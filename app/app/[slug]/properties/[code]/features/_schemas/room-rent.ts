import * as z from "zod";

export const roomRentFeaturesSchema = z.object({
  roomRentFeatures: z.array(z.string()).default([]),
});

export type RoomRentFeaturesFormData = z.infer<typeof roomRentFeaturesSchema>;