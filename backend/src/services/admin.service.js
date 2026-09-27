import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import { signAdminToken } from "../config/jwt.js";

export const loginAdmin = async ({ email, password }) => {
  const admin = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!admin || !admin.active) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);

  if (!passwordMatches) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  return {
    token: signAdminToken(admin),
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
};

export const getDashboardStats = async () => {
  const [
    totalBookings,
    pendingBookings,
    confirmedBookings,
    paidBookings,
    failedPayments,
    totalContacts,
    newContacts,
    totalRevenue,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { paymentStatus: "PAID" } }),
    prisma.booking.count({ where: { paymentStatus: "FAILED" } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.booking.aggregate({
      _sum: { amountPaid: true },
      where: { paymentStatus: "PAID" },
    }),
  ]);

  const recentBookings = await prisma.booking.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    select: {
      bookingReference: true,
      fullName: true,
      email: true,
      status: true,
      paymentStatus: true,
      amountPaid: true,
      createdAt: true,
      coursePlan: {
        select: { name: true, course: { select: { name: true } } },
      },
    },
  });

  return {
    counts: {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      paidBookings,
      failedPayments,
      totalContacts,
      newContacts,
    },
    revenue: Number(totalRevenue._sum.amountPaid || 0),
    recentBookings,
  };
};

function parseDateBoundary(value, endOfDay = false) {
  if (!value) return undefined;
  const date = new Date(
    `${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`,
  );
  if (Number.isNaN(date.getTime())) {
    const error = new Error(`Invalid date filter: ${value}`);
    error.statusCode = 400;
    throw error;
  }
  return date;
}

export const getBookings = async ({
  page,
  limit,
  status,
  paymentStatus,
  search,
  from,
  to,
}) => {
  const createdAt = {};
  const fromDate = parseDateBoundary(from);
  const toDate = parseDateBoundary(to, true);
  if (fromDate) createdAt.gte = fromDate;
  if (toDate) createdAt.lte = toDate;

  const where = {
    ...(status ? { status } : {}),
    ...(paymentStatus ? { paymentStatus } : {}),
    ...(Object.keys(createdAt).length ? { createdAt } : {}),
    ...(search
      ? {
          OR: [
            { bookingReference: { contains: search, mode: "insensitive" } },
            { fullName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        bookingReference: true,
        fullName: true,
        email: true,
        phone: true,
        age: true,
        gender: true,
        purpose: true,
        message: true,
        status: true,
        paymentStatus: true,
        amountPaid: true,
        razorpayOrderId: true,
        razorpayPaymentId: true,
        paidAt: true,
        createdAt: true,
        updatedAt: true,
        coursePlan: {
          select: {
            name: true,
            price: true,
            course: { select: { name: true, slug: true } },
          },
        },
      },
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const updateBookingStatus = async (id, status) => {
  return prisma.booking.update({
    where: { id },
    data: { status },
    select: { bookingReference: true, status: true, paymentStatus: true },
  });
};

export const getBookingById = async (id) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { coursePlan: { include: { course: true } } },
  });
  if (!booking) {
    const error = new Error("Booking not found.");
    error.statusCode = 404;
    throw error;
  }
  return booking;
};

export const getContacts = async ({ page, limit, status, search }) => {
  const where = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { subject: { contains: search, mode: "insensitive" } },
            { message: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contactMessage.count({ where }),
  ]);

  return {
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const updateContactStatus = async (id, status) => {
  return prisma.contactMessage.update({
    where: { id },
    data: { status },
  });
};
