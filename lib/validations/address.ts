import * as z from "zod";

export const addressFormSchema = z.object({
  zipcode: z.string()
    .min(8, "CEP inválido")
    .max(9, "CEP inválido")
    .regex(/^\d{5}-?\d{3}$/, "Formato de CEP inválido"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
});

export const addressSchema = z.object({
  zipcode: z.string(),
  street: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  stateCode: z.string(),
  number: z.string(),
  complement: z.string().optional(),
});

export type AddressFormData = z.infer<typeof addressFormSchema>;
export type AddressData = z.infer<typeof addressSchema>;

// import * as z from "zod";

// export const addressFormSchema = z.object({
//   zipcode: z.string().min(8, "CEP inválido").max(9, "CEP inválido"),
//   number: z.string().min(1, "Número é obrigatório"),
//   complement: z.string().optional(),
// });

// export type AddressFormData = z.infer<typeof addressFormSchema>;