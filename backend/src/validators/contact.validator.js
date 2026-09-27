import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  email: z.string().trim().email("Please provide a valid email address"),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .optional()
    .or(z.literal("")),

  subject: z
    .string()
    .trim()
    .max(200, "Subject is too long")
    .optional()
    .or(z.literal("")),

  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters")
    .max(2000, "Message is too long"),
});
