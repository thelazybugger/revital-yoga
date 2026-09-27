import { verifyWebhookSignature, processRazorpayWebhook } from "../services/webhook.service.js";

export const razorpayWebhookController = async (req, res) => {
  try {
    const signature = req.get("x-razorpay-signature");
    const eventId = req.get("x-razorpay-event-id");

    if (!eventId) {
      return res.status(400).json({ success: false, message: "Missing Razorpay event ID" });
    }

    const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from("");

    if (!verifyWebhookSignature(rawBody, signature)) {
      return res.status(400).json({ success: false, message: "Invalid webhook signature" });
    }

    let payload;
    try {
      payload = JSON.parse(rawBody.toString("utf8"));
    } catch {
      return res.status(400).json({ success: false, message: "Invalid webhook payload" });
    }

    const result = await processRazorpayWebhook({
      eventId,
      event: payload.event,
      payload
    });

    return res.status(200).json({
      success: true,
      duplicate: Boolean(result.duplicate),
      processed: Boolean(result.processed)
    });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return res.status(500).json({ success: false, message: "Webhook processing failed" });
  }
};
