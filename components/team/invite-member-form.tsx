"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Role } from "@prisma/client"
import { InviteMemberFormData, inviteMemberSchema } from "@/lib/validations/team"
import { inviteMember } from "@/lib/actions/team"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { RoleSelect } from "./role-select"

interface InviteMemberFormProps {
  organizationId: string
  roles: Role[]
  onSuccess?: () => void
}

export function InviteMemberForm({ organizationId, roles, onSuccess }: InviteMemberFormProps) {
  const [error, setError] = useState<string>("")
  
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
  })

  const onSubmit = async (data: InviteMemberFormData) => {
    try {
      const result = await inviteMember(organizationId, data)
      if (result.success) {
        reset()
        onSuccess?.()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <Alert variant="destructive">{error}</Alert>}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="Enter member's email"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Role</Label>
        <RoleSelect
          roles={roles}
          currentRoleId={getValues("roleId")} 
          onRoleChange={(roleId) => setValue("roleId", `${roleId}`)}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Inviting..." : "Invite Member"}
      </Button>
    </form>
  )
}