import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

export async function generatePasswordResetToken(userId: string) {
  const token = randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + 3600000) // 1 hora

  const existingToken = await prisma.passwordResetToken.findFirst({
    where: { userId },
  })

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    })
  }

  const resetToken = await prisma.passwordResetToken.create({
    data: {
      token,
      expires,
      userId,
    },
  })

  return resetToken.token
}

export async function validatePasswordResetToken(token: string) {
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      token,
      expires: { gt: new Date() },
    },
    include: {
      user: true,
    },
  })

  if (!resetToken) {
    return null
  }

  return resetToken.user
}