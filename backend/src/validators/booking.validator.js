import { z } from "zod";

export const bookingSchema = z.object({
  coursePlanId: z.number().int().positive(),

  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  email: z.string().trim().email("Please provide a valid email address"),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),

  age: z.number().int().min(1, "Invalid age").max(120, "Invalid age"),

  gender: z.string().trim().min(1, "Gender is required"),

  purpose: z.enum(["Yoga", "Healing", "Both"]),

  message: z.string().trim().max(1000, "Message is too long").optional(),

  termsAccepted: z.literal(true, {
    errorMap: () => ({
      message: "You must accept the terms and conditions",
    }),
  }),
});
