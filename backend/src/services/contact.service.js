import prisma from "../config/prisma.js";

export const createContactMessage = async (contactData) => {
  const { name, email, phone, subject, message } = contactData;

  const contactMessage = await prisma.contactMessage.create({
    data: {
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      status: "NEW",
    },
  });

  return contactMessage;
};
