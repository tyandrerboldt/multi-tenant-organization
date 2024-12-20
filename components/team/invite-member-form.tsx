"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { inviteMember } from "@/lib/actions/team";
import { EDITABLE_ROLES, ROLE_TRANSLATIONS } from "@/lib/constants/roles";
import {
  InviteMemberFormData,
  inviteMemberSchema,
} from "@/lib/validations/team";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface InviteMemberFormProps {
  organizationId: string;
  onSuccess?: () => void;
}

export function InviteMemberForm({
  organizationId,
  onSuccess,
}: InviteMemberFormProps) {
  const [error, setError] = useState<string>("");

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
  });

  const onSubmit = async (data: InviteMemberFormData) => {
    try {
      const result = await inviteMember(organizationId, data);
      if (result.success) {
        reset();
        onSuccess?.();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    }
  };

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
        <Label htmlFor="role">Função</Label>
        <Select
          onValueChange={(value) => setValue("role", value as Role)}
          defaultValue={Role.MEMBER}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma função" />
          </SelectTrigger>
          <SelectContent>
            {EDITABLE_ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {ROLE_TRANSLATIONS[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-red-500">{errors.role.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Convidando..." : "Convidar Membro"}
      </Button>
    </form>
  );
}
