"use server"

import { hash } from "bcrypt"
import { prisma } from "@/lib/prisma"
import { RegisterFormData } from "@/lib/validations/auth"
import { sendPasswordResetEmail } from "@/lib/email"
import { generatePasswordResetToken } from "@/lib/tokens"

export async function registerUser(data: RegisterFormData) {
  const { name, email, password } = data
  
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error("Email já está em uso")
  }

  const hashedPassword = await hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  return { success: true, user: { id: user.id, name: user.name, email: user.email } }
}

export async function resetPassword(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    // Retornamos sucesso mesmo se o usuário não existir para evitar enumeração de emails
    return { success: true }
  }

  const token = await generatePasswordResetToken(user.id)
  await sendPasswordResetEmail(user.email, token)

  return { success: true }
}