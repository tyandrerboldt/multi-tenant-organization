import * as z from "zod";

export const ownerSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  alternativePhone: z.string().optional(),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  notes: z.string().optional(),
});

export type OwnerFormData = z.infer<typeof ownerSchema>;