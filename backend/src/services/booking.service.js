import prisma from "../config/prisma.js";

function generateBookingReference() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(10000 + Math.random() * 90000);
  return `RV-${date}-${random}`;
}

export const createBooking = async (bookingData) => {
  const {
    coursePlanId,
    fullName,
    email,
    phone,
    age,
    gender,
    purpose,
    message,
    termsAccepted,
  } = bookingData;

  const coursePlan = await prisma.coursePlan.findFirst({
    where: {
      id: coursePlanId,
      active: true,
      course: { active: true },
    },
    include: { course: true },
  });

  if (!coursePlan) {
    const error = new Error("Selected course plan does not exist");
    error.statusCode = 404;
    throw error;
  }

  let bookingReference;

  do {
    bookingReference = generateBookingReference();

    const existingBooking = await prisma.booking.findUnique({
      where: { bookingReference },
    });

    if (!existingBooking) break;
  } while (true);

  return prisma.booking.create({
    data: {
      bookingReference,
      coursePlanId,
      fullName,
      email,
      phone,
      age,
      gender,
      purpose,
      message: message || null,
      termsAccepted,
      status: "PENDING",
      paymentStatus: "PENDING",
      amountPaid: 0,
    },
    include: {
      coursePlan: {
        include: { course: true },
      },
    },
  });
};
