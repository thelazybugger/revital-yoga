import crypto from "crypto";
import prisma from "../config/prisma.js";
import razorpay from "../config/razorpay.js";
import { sendBookingEmails } from "./email.service.js";

function generateReceipt(bookingReference) {
  // Razorpay receipts should be short and unique enough for the merchant order.
  return bookingReference.replace(/[^a-zA-Z0-9_-]/g, "").slice(-40);
}

export const createPaymentOrder = async (bookingReference) => {
  const booking = await prisma.booking.findUnique({
    where: { bookingReference },
    include: {
      coursePlan: {
        include: { course: true }
      }
    }
  });

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (booking.status !== "PENDING") {
    const error = new Error("This booking is no longer pending payment");
    error.statusCode = 409;
    throw error;
  }

  if (booking.paymentStatus === "PAID") {
    const error = new Error("This booking has already been paid");
    error.statusCode = 409;
    throw error;
  }

  const amount = Number(booking.coursePlan.price);

  // Free plans do not need a Razorpay order.
  if (amount === 0) {
    const confirmedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "CONFIRMED",
        paymentStatus: "PAID",
        amountPaid: 0,
        paidAt: new Date()
      },
      include: {
        coursePlan: {
          include: { course: true }
        }
      }
    });

    await sendBookingEmails(confirmedBooking);

    return {
      free: true,
      booking: confirmedBooking
    };
  }

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt: generateReceipt(booking.bookingReference),
    notes: {
      bookingReference: booking.bookingReference,
      coursePlanId: String(booking.coursePlanId),
      customerEmail: booking.email
    }
  });

  const updatedBooking = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      razorpayOrderId: order.id,
      paymentStatus: "PENDING"
    },
    include: {
      coursePlan: {
        include: { course: true }
      }
    }
  });

  return {
    free: false,
    booking: updatedBooking,
    order
  };
};

export const verifyPayment = async ({
  bookingReference,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
}) => {
  const booking = await prisma.booking.findUnique({
    where: { bookingReference },
    include: {
      coursePlan: {
        include: { course: true }
      }
    }
  });

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (!booking.razorpayOrderId || booking.razorpayOrderId !== razorpayOrderId) {
    const error = new Error("Payment order does not match this booking");
    error.statusCode = 400;
    throw error;
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const signaturesMatch =
    expectedSignature.length === razorpaySignature.length &&
    crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpaySignature)
    );

  if (!signaturesMatch) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { paymentStatus: "FAILED" }
    });

    const error = new Error("Payment signature verification failed");
    error.statusCode = 400;
    throw error;
  }

  // Ask Razorpay for the payment status before confirming the booking.
  const payment = await razorpay.payments.fetch(razorpayPaymentId);

  if (payment.order_id !== razorpayOrderId) {
    const error = new Error("Payment order mismatch");
    error.statusCode = 400;
    throw error;
  }

  if (payment.status !== "captured") {
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: "FAILED",
        razorpayPaymentId
      }
    });

    const error = new Error(`Payment is not captured. Current status: ${payment.status}`);
    error.statusCode = 400;
    throw error;
  }

  const expectedAmount = Math.round(Number(booking.coursePlan.price) * 100);

  if (Number(payment.amount) !== expectedAmount || payment.currency !== "INR") {
    const error = new Error("Payment amount or currency does not match the booking");
    error.statusCode = 400;
    throw error;
  }

  // Idempotency: if the booking is already confirmed, return it.
  if (booking.paymentStatus === "PAID") {
    return booking;
  }

  const confirmedBooking = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: "CONFIRMED",
      paymentStatus: "PAID",
      amountPaid: Number(payment.amount) / 100,
      razorpayPaymentId,
      paidAt: new Date()
    },
    include: {
      coursePlan: {
        include: { course: true }
      }
    }
  });

  await sendBookingEmails(confirmedBooking);

  return confirmedBooking;
};
