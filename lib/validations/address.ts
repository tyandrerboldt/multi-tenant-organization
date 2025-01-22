import * as z from "zod";

export const addressFormSchema = z.object({
  zipcode: z.string().min(8, "CEP inválido").max(9, "CEP inválido"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
});

export type AddressFormData = z.infer<typeof addressFormSchema>;