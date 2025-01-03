"use client"

import { useState } from "react"
import { inviteMember } from "@/lib/actions/team"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { RoleSelect } from "./role-select"
import { Role } from "@/lib/types/permissions"

interface InviteMemberFormProps {
  organizationId: string
  customRoles: Role[]
  onSuccess?: () => void
}

export function InviteMemberForm({ 
  organizationId, 
  customRoles, 
  onSuccess 
}: InviteMemberFormProps) {
  const [email, setEmail] = useState("")
  const [roleId, setRoleId] = useState<string>("NOTTING")
  const [error, setError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!email || !roleId) {
      setError("Email e função são obrigatórios")
      return
    }

    setError("")
    setIsSubmitting(true)

    try {
      const result = await inviteMember(organizationId, { email, roleId })
      if (result.success) {
        setEmail("")
        setRoleId("NOTTING")
        onSuccess?.()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Algo deu errado")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="destructive">{error}</Alert>}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter member's email"
        />
      </div>

      <div className="space-y-2">
        <Label>Role</Label>
        <RoleSelect
          roles={customRoles}
          currentRoleId={roleId}
          onRoleChange={(roleId) => setRoleId(`${roleId}`)}
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
