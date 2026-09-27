import {
  adminLoginSchema,
  bookingListQuerySchema,
  contactListQuerySchema,
  updateBookingStatusSchema,
  updateContactStatusSchema,
} from "../validators/admin.validator.js";
import {
  loginAdmin,
  getDashboardStats,
  getBookings,
  getBookingById,
  updateBookingStatus,
  getContacts,
  updateContactStatus,
} from "../services/admin.service.js";

export const adminLoginController = async (req, res, next) => {
  try {
    const data = adminLoginSchema.parse(req.body);
    const result = await loginAdmin(data);
    res.json({
      success: true,
      message: "Admin login successful.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const dashboardStatsController = async (req, res, next) => {
  try {
    res.json({ success: true, data: await getDashboardStats() });
  } catch (error) {
    next(error);
  }
};

export const bookingsController = async (req, res, next) => {
  try {
    const query = bookingListQuerySchema.parse(req.query);
    res.json({ success: true, data: await getBookings(query) });
  } catch (error) {
    next(error);
  }
};

export const bookingDetailController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid booking ID." });
    }
    res.json({ success: true, data: await getBookingById(id) });
  } catch (error) {
    next(error);
  }
};

export const bookingStatusController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid booking ID." });
    }
    const { status } = updateBookingStatusSchema.parse(req.body);
    res.json({
      success: true,
      message: "Booking status updated.",
      data: await updateBookingStatus(id, status),
    });
  } catch (error) {
    next(error);
  }
};

export const contactsController = async (req, res, next) => {
  try {
    const query = contactListQuerySchema.parse(req.query);
    res.json({ success: true, data: await getContacts(query) });
  } catch (error) {
    next(error);
  }
};

export const contactStatusController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid contact ID." });
    }
    const { status } = updateContactStatusSchema.parse(req.body);
    res.json({
      success: true,
      message: "Contact status updated.",
      data: await updateContactStatus(id, status),
    });
  } catch (error) {
    next(error);
  }
};
