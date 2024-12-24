import nodemailer from "nodemailer"

interface EmailOptions {
  to: string
  subject: string
  html: string
  text: string
}

export async function sendEmail(options: EmailOptions) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    ...options,
  })
}