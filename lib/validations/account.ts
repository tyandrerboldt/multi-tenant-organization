import * as z from "zod"

export const accountSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  image: z.string().url({ message: "URL inválida" }).optional().or(z.literal("")),
})

export type AccountFormData = z.infer<typeof accountSchema>