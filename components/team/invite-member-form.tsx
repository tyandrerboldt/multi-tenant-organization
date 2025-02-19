"use client";

import { UpgradePlanModal } from "@/components/billing/upgrade-plan-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteMember } from "@/lib/actions/team";
import { usePlanRestrictions } from "@/lib/plans/hooks/use-plan-restriction";
import { Role } from "@/lib/types/permissions";
import { Plan } from "@prisma/client";
import { useState } from "react";
import { RoleSelect } from "./role-select";
import { showToast } from "@/lib/toast";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isUpgradeModalOpen, setIsUpgradeModalOpen, checkAndEnforceLimit } =
    usePlanRestrictions({
      plan,
      usage: { members: currentUsage, domains: 0 },
    });

  const validateEmail = (email: string) => {
    if (!email) return "Email é obrigatório";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Endereço de email inválido";
    return null;
  };

  const resetForm = () => {
    setEmail("");
    setRoleId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      showToast(emailError, { variant: "error" });
      return;
    }

    if (!checkAndEnforceLimit("members")) {
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await inviteMember(organizationId, { email, roleId });
      if (result.success) {
        showToast("Membro convidado com sucesso", { variant: "success" });
        resetForm();
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao convidar membro",
        { variant: "error" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite o e-mail do membro"
          />
        </div>

        <div className="space-y-2">
          <Label>Função</Label>
          <RoleSelect
            roles={customRoles}
            currentRoleId={roleId}
            onRoleChange={setRoleId}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Convidando..." : "Convidar membro"}
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
