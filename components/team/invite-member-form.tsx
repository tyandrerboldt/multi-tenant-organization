"use client";

import { UpgradePlanModal } from "@/components/billing/upgrade-plan-modal";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteMember } from "@/lib/actions/team";
import { usePlanRestrictions } from "@/lib/plans/hooks/use-plan-restriction";
import { Role } from "@/lib/types/permissions";
import {
  InviteMemberFormData,
  inviteMemberSchema,
} from "@/lib/validations/team";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plan } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RoleSelect } from "./role-select";

interface InviteMemberFormProps {
  organizationId: string;
  customRoles: Role[];
  plan: Plan;
  currentUsage: number;
}

export function InviteMemberForm({
  organizationId,
  customRoles,
  plan,
  currentUsage,
}: InviteMemberFormProps) {
  const [error, setError] = useState<string>("");

  const { isUpgradeModalOpen, setIsUpgradeModalOpen, checkAndEnforceLimit } =
    usePlanRestrictions({
      plan,
      usage: { members: currentUsage, domains: 0 },
    });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
  });

  const onSubmit = async (data: InviteMemberFormData) => {
    if (!checkAndEnforceLimit("members")) {
      return;
    }

    try {
      const result = await inviteMember(organizationId, data);
      if (result.success) {
        reset();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <>
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
            roles={customRoles}
            onRoleChange={(roleId) => setValue("roleId", roleId)}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Inviting..." : "Invite Member"}
        </Button>
      </form>

      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        organizationId={organizationId}
        currentPlan={plan}
      />
    </>
  );
}
