import { Router } from "express";
import { razorpayWebhookController } from "../controllers/webhook.controller.js";

const router = Router();

router.post("/razorpay", razorpayWebhookController);

export default router;
