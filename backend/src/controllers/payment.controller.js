import {
  createOrderSchema,
  verifyPaymentSchema
} from "../validators/payment.validator.js";
import {
  createPaymentOrder,
  verifyPayment
} from "../services/payment.service.js";

export const createPaymentOrderController = async (req, res, next) => {
  try {
    const { bookingReference } = createOrderSchema.parse(req.body);

    const result = await createPaymentOrder(bookingReference);

    if (result.free) {
      return res.status(200).json({
        success: true,
        free: true,
        message: "Free booking confirmed successfully.",
        data: {
          bookingReference: result.booking.bookingReference,
          status: result.booking.status,
          paymentStatus: result.booking.paymentStatus
        }
      });
    }

    return res.status(201).json({
      success: true,
      free: false,
      data: {
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: result.order.id,
        amount: result.order.amount,
        currency: result.order.currency,
        bookingReference: result.booking.bookingReference,
        customer: {
          name: result.booking.fullName,
          email: result.booking.email,
          phone: result.booking.phone
        },
        course: result.booking.coursePlan.course.name,
        plan: result.booking.coursePlan.name
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPaymentController = async (req, res, next) => {
  try {
    const validatedData = verifyPaymentSchema.parse(req.body);

    const booking = await verifyPayment(validatedData);

    return res.status(200).json({
      success: true,
      message: "Payment verified and booking confirmed.",
      data: {
        bookingReference: booking.bookingReference,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        amountPaid: booking.amountPaid
      }
    });
  } catch (error) {
    next(error);
  }
};
