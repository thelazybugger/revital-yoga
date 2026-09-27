import { Router } from "express";
import { createContactController } from "../controllers/contact.controller.js";
import { contactRateLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

router.post("/", contactRateLimiter, createContactController);

export default router;
