"use client";

import { UpgradePlanModal } from "@/components/billing/upgrade-plan-modal";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteMember } from "@/lib/actions/team";
import { usePlanRestrictions } from "@/lib/plans/hooks/use-plan-restriction";
import { Role } from "@/lib/types/permissions";
import { Plan } from "@prisma/client";
import { useState } from "react";
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
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isUpgradeModalOpen, setIsUpgradeModalOpen, checkAndEnforceLimit } =
    usePlanRestrictions({
      plan,
      usage: { members: currentUsage, domains: 0 },
    });

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Invalid email address";
    return null;
  };

  const resetForm = () => {
    setEmail("");
    setRoleId(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    if (!checkAndEnforceLimit("members")) {
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const result = await inviteMember(organizationId, { email, roleId });
      if (result.success) {
        resetForm();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
            onRoleChange={setRoleId}
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
