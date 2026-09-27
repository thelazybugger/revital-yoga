import { z } from "zod";

export const createOrderSchema = z.object({
  bookingReference: z.string().trim().min(5).max(50)
});

export const verifyPaymentSchema = z.object({
  bookingReference: z.string().trim().min(5).max(50),
  razorpayOrderId: z.string().trim().min(5).max(100),
  razorpayPaymentId: z.string().trim().min(5).max(100),
  razorpaySignature: z.string().trim().min(10).max(200)
});
