import nodemailer from "nodemailer";
import { ENV } from "./env.js";

export const mailer = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  port: ENV.SMTP_PORT,
  auth: ENV.SMTP_USER && ENV.SMTP_PASS ? { user: ENV.SMTP_USER, pass: ENV.SMTP_PASS } : undefined
});

export async function sendWelcomeEmail(to, fullName) {
  if (!ENV.SMTP_HOST || !ENV.SMTP_USER || !ENV.SMTP_PASS) return; // allow running without smtp
  await mailer.sendMail({
    from: ENV.MAIL_FROM,
    to,
    subject: "Welcome to UNT University Analyzer",
    text: `Hi ${fullName}! Welcome. You can now analyze your UNT scores and get recommendations.`
  });
}
