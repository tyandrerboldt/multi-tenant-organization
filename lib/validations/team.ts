import * as z from "zod"

export const inviteMemberSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  roleId: z.string().optional(),
})

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>