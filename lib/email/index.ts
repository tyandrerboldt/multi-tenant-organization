import { sendEmail } from "./send-email"
import { createResetPasswordEmail } from "./templates/reset-password"

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`
  
  const { subject, html, text } = createResetPasswordEmail(resetUrl)
  
  await sendEmail({
    to: email,
    subject,
    html,
    text,
  })
}