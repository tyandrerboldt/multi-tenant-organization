import * as z from "zod";

export const apartmentFeaturesSchema = z.object({
  apartmentType: z.string().min(1, "Tipo do apartamento é obrigatório"),
  rooms: z.preprocess((val) => Number(val), z.number().min(0, "Deve ser um número positivo")),
  bathrooms: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  garageSpaces: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  size: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  apartmentFeatures: z.array(z.string()).default([]),
  apartmentComplexFeatures: z.array(z.string()).default([]),
  iptu: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  condominio: z.preprocess((val) => Number(val), z.number().min(0).optional()),
});

export type ApartmentFeaturesFormData = z.infer<typeof apartmentFeaturesSchema>;