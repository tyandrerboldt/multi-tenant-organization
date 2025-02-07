import * as z from "zod";

export const commercialFeaturesSchema = z.object({
  commercialType: z.string({
    required_error: "Tipo do imóvel é obrigatório",
  }),
  size: z.string().optional(),
  garageSpaces: z.string().optional(),
  commercialFeatures: z.array(z.string()).default([]),
  iptu: z.string().optional(),
  condominio: z.string().optional(),
});

export type CommercialFeaturesFormData = z.infer<typeof commercialFeaturesSchema>;