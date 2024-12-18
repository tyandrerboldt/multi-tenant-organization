import * as z from "zod"

export const domainSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Domain name is required" })
    .regex(
      /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      { message: "Invalid domain format" }
    ),
})

export type DomainFormData = z.infer<typeof domainSchema>