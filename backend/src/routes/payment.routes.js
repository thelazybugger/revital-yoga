import { Router } from "express";
import {
  createPaymentOrderController,
  verifyPaymentController
} from "../controllers/payment.controller.js";
import { bookingRateLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

router.post("/create-order", bookingRateLimiter, createPaymentOrderController);
router.post("/verify", bookingRateLimiter, verifyPaymentController);

export default router;
