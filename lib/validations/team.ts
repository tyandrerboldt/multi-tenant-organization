import * as z from "zod"
import { Role } from "@prisma/client"

export const inviteMemberSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum([Role.ADMIN, Role.MEMBER], {
    required_error: "Please select a role",
  }),
})

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>