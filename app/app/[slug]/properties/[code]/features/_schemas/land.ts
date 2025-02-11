import * as z from "zod";

export const landFeaturesSchema = z.object({
  reLandType: z.string({
    required_error: "Tipo do terreno é obrigatório",
  }),
  size: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  reLandFeatures: z.array(z.string()).default([]),
  iptu: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  condominio: z.preprocess((val) => Number(val), z.number().min(0).optional()),
});

export type LandFeaturesFormData = z.infer<typeof landFeaturesSchema>;