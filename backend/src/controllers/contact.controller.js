import { contactSchema } from "../validators/contact.validator.js";
import { createContactMessage } from "../services/contact.service.js";
import { sendContactEmail } from "../services/email.service.js";

export const createContactController = async (req, res, next) => {
  try {
    const validatedData = contactSchema.parse(req.body);

    const contactMessage = await createContactMessage(validatedData);

    // The enquiry is already safely stored in the database. Email delivery
    // failure is logged by the email service and does not discard the enquiry.
    await sendContactEmail(contactMessage);

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    next(error);
  }
};
