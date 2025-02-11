import * as z from "zod";

export const houseFeaturesSchema = z.object({
  homeType: z.string({
    required_error: "Tipo da casa é obrigatório",
  }),
  rooms: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  bathrooms: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  garageSpaces: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  size: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  homeFeatures: z.array(z.string()).default([]),
  homeComplexFeatures: z.array(z.string()).default([]),
  iptu: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  condominio: z.preprocess((val) => Number(val), z.number().min(0).optional()),
});

export type HouseFeaturesFormData = z.infer<typeof houseFeaturesSchema>;