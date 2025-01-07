import * as z from "zod"

export const preferencesSchema = z.object({
  defaultOrganizationId: z.string().optional(),
  theme: z.enum(["light", "dark"]).default("light"),
})

export type PreferencesFormData = z.infer<typeof preferencesSchema>