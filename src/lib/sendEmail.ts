import nodemailer from "nodemailer";

type SendEmailProps = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export default async function sendEmail({
  to,
  subject,
  text,
  html,
}: SendEmailProps) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER!,
    to,
    subject,
    text,
    html,
  });
}
