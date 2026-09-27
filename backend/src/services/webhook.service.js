import crypto from "crypto";
import prisma from "../config/prisma.js";
import { sendBookingEmails } from "./email.service.js";

function timingSafeEqualHex(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
  } catch {
    return false;
  }
}

export function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  return timingSafeEqualHex(expected, signature);
}

function getPaymentEntity(payload) {
  return payload?.payload?.payment?.entity ?? null;
}

export async function processRazorpayWebhook({ eventId, event, payload }) {
  const existing = await prisma.paymentWebhookEvent.findUnique({
    where: { eventId }
  });

  if (existing?.processedAt) {
    return { duplicate: true, processed: true };
  }

  const payment = getPaymentEntity(payload);

  if (!existing) {
    try {
      await prisma.paymentWebhookEvent.create({
        data: {
          eventId,
          event,
          payload
        }
      });
    } catch (error) {
      if (error.code === "P2002") {
        return { duplicate: true };
      }
      throw error;
    }
  }

  if (!payment?.id) {
    await prisma.paymentWebhookEvent.update({
      where: { eventId },
      data: { processedAt: new Date() }
    });
    return { duplicate: false, processed: false };
  }

  const orderId = payment.order_id;
  if (!orderId) {
    await prisma.paymentWebhookEvent.update({
      where: { eventId },
      data: { processedAt: new Date() }
    });
    return { duplicate: false, processed: false };
  }

  const booking = await prisma.booking.findUnique({
    where: { razorpayOrderId: orderId },
    include: { coursePlan: { include: { course: true } } }
  });

  if (!booking) {
    console.warn(`Razorpay webhook: no booking found for order ${orderId}`);
    await prisma.paymentWebhookEvent.update({
      where: { eventId },
      data: { processedAt: new Date() }
    });
    return { duplicate: false, processed: false };
  }

  const expectedAmount = Math.round(Number(booking.coursePlan.price) * 100);

  if (Number(payment.amount) !== expectedAmount || payment.currency !== "INR") {
    console.error(`Razorpay webhook: amount/currency mismatch for booking ${booking.bookingReference}`);
    await prisma.paymentWebhookEvent.update({
      where: { eventId },
      data: { processedAt: new Date() }
    });
    return { duplicate: false, processed: false };
  }

  if (event === "payment.captured" || event === "order.paid") {
    if (booking.paymentStatus === "PAID") {
      return { duplicate: false, processed: true, alreadyPaid: true };
    }

    const confirmedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "CONFIRMED",
        paymentStatus: "PAID",
        amountPaid: Number(payment.amount) / 100,
        razorpayPaymentId: payment.id,
        paidAt: new Date()
      },
      include: { coursePlan: { include: { course: true } } }
    });

    await sendBookingEmails(confirmedBooking);

    await prisma.paymentWebhookEvent.update({
      where: { eventId },
      data: { processedAt: new Date() }
    });

    return { duplicate: false, processed: true };
  }

  if (event === "payment.failed") {
    if (booking.paymentStatus !== "PAID") {
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: "FAILED",
          razorpayPaymentId: payment.id || null
        }
      });
    }

    await prisma.paymentWebhookEvent.update({
      where: { eventId },
      data: { processedAt: new Date() }
    });

    return { duplicate: false, processed: true };
  }

  await prisma.paymentWebhookEvent.update({
    where: { eventId },
    data: { processedAt: new Date() }
  });

  return { duplicate: false, processed: false };
}
