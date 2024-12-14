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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert } from "@/components/ui/alert"

interface InviteMemberFormProps {
  organizationId: string
  onSuccess?: () => void
}

export function InviteMemberForm({ organizationId, onSuccess }: InviteMemberFormProps) {
  const [error, setError] = useState<string>("")
  
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      role: Role.MEMBER,
    },
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
        <Label htmlFor="role">Role</Label>
        <Select
          onValueChange={(value) => setValue("role", value as Role)}
          defaultValue={Role.MEMBER}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Role.ADMIN}>Admin</SelectItem>
            <SelectItem value={Role.MEMBER}>Member</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-red-500">{errors.role.message}</p>
        )}
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