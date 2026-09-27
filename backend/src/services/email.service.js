import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeText(value = "") {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

function formatPrice(price) {
  const numericPrice = Number(price);

  if (numericPrice === 0) {
    return "Free";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericPrice);
}

async function sendMailSafely(mailOptions, label) {
  try {
    await transporter.sendMail(mailOptions);
    console.log(`${label} email sent successfully.`);
    return true;
  } catch (error) {
    console.error(`${label} email failed:`, error);
    return false;
  }
}

export const verifyEmailTransport = async () => {
  try {
    await transporter.verify();
    console.log("SMTP connection verified.");
    return true;
  } catch (error) {
    console.error("SMTP connection verification failed:", error);
    return false;
  }
};

export const sendBookingEmails = async (booking) => {
  const {
    bookingReference,
    fullName,
    email,
    phone,
    age,
    gender,
    purpose,
    message,
    status,
    coursePlan,
  } = booking;

  const courseName = coursePlan.course.name;
  const planName = coursePlan.name;
  const price = formatPrice(coursePlan.price);

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1e293b">
      <h2>New Yoga Booking</h2>
      <p><strong>Booking Reference:</strong> ${escapeHtml(bookingReference)}</p>
      <hr>
      <p><strong>Course:</strong> ${escapeHtml(courseName)}</p>
      <p><strong>Plan:</strong> ${escapeHtml(planName)}</p>
      <p><strong>Price:</strong> ${escapeHtml(price)}</p>
      <p><strong>Status:</strong> ${escapeHtml(status)}</p>
      <hr>
      <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Age:</strong> ${escapeHtml(age)}</p>
      <p><strong>Gender:</strong> ${escapeHtml(gender)}</p>
      <p><strong>Purpose:</strong> ${escapeHtml(purpose)}</p>
      <p><strong>Message:</strong><br>${safeText(message || "No message")}</p>
    </div>
  `;

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1e293b">
      <h2>Revital Yoga Booking Confirmation</h2>
      <p>Hello ${escapeHtml(fullName)},</p>
      <p>Thank you for registering with Revital Yoga and Healing Centre.</p>
      <p><strong>Booking Reference:</strong> ${escapeHtml(bookingReference)}</p>
      <p><strong>Course:</strong> ${escapeHtml(courseName)}</p>
      <p><strong>Plan:</strong> ${escapeHtml(planName)}</p>
      <p><strong>Price:</strong> ${escapeHtml(price)}</p>
      <p>Your registration has been received and is currently <strong>${escapeHtml(status)}</strong>.</p>
      <p>We will contact you with the next steps.</p>
      <p>Regards,<br>Revital Yoga and Healing Centre</p>
    </div>
  `;

  await Promise.all([
    sendMailSafely(
      {
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        replyTo: email,
        subject: `New Yoga Booking - ${bookingReference}`,
        html: adminHtml,
      },
      "Admin booking",
    ),
    sendMailSafely(
      {
        from: process.env.MAIL_FROM,
        to: email,
        subject: `Revital Yoga Booking Confirmation - ${bookingReference}`,
        html: customerHtml,
      },
      "Customer booking",
    ),
  ]);
};

export const sendContactEmail = async (contactMessage) => {
  const { name, email, phone, subject, message } = contactMessage;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1e293b">
      <h2>New Contact Enquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject || "No subject")}</p>
      <p><strong>Message:</strong><br>${safeText(message)}</p>
    </div>
  `;

  await sendMailSafely(
    {
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: `New Contact Enquiry${subject ? ` - ${escapeHtml(subject)}` : ""}`,
      html,
    },
    "Contact",
  );
};
