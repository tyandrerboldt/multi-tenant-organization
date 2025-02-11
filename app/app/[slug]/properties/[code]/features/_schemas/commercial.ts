import * as z from "zod";

export const commercialFeaturesSchema = z.object({
  commercialType: z.string({
    required_error: "Tipo do imóvel é obrigatório",
  }),
  size: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  garageSpaces: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  commercialFeatures: z.array(z.string()).default([]),
  iptu: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  condominio: z.preprocess((val) => Number(val), z.number().min(0).optional()),
});

export type CommercialFeaturesFormData = z.infer<typeof commercialFeaturesSchema>;