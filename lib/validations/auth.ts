import * as z from "zod"

export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
})

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
})

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>