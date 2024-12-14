"use server"

import { hash } from "bcrypt"
import { prisma } from "@/lib/prisma"
import { RegisterFormData } from "@/lib/validations/auth"

export async function registerUser(data: RegisterFormData) {
  const { name, email, password } = data
  
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error("Email already exists")
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