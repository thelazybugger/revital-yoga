import { bookingSchema } from "../validators/booking.validator.js";
import { createBooking } from "../services/booking.service.js";

export const createBookingController = async (req, res, next) => {
  try {
    const validatedData = bookingSchema.parse(req.body);
    const booking = await createBooking(validatedData);
    const price = Number(booking.coursePlan.price);

    return res.status(201).json({
      success: true,
      message:
        price === 0
          ? "Free booking created. Continue to confirm your registration."
          : "Booking created. Continue to payment.",
      data: {
        bookingReference: booking.bookingReference,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        course: booking.coursePlan.course.name,
        plan: booking.coursePlan.name,
        price: booking.coursePlan.price,
        customer: {
          name: booking.fullName,
          email: booking.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
