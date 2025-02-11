"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OwnerFormData, ownerSchema } from "@/lib/validations/owner";
import { createOwner, updateOwner } from "@/lib/actions/owners";
import { showToast } from "@/lib/toast";
import { useEffect } from "react";

interface OwnerFormProps {
  organizationId: string;
  owner?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    alternativePhone?: string | null;
    cpf?: string | null;
    cnpj?: string | null;
    notes?: string | null;
  };
}

export function OwnerForm({ organizationId, owner }: OwnerFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OwnerFormData>({
    resolver: zodResolver(ownerSchema),
    defaultValues: owner || {},
  });

  // Watch fields for mask application
  const phone = watch("phone");
  const alternativePhone = watch("alternativePhone");
  const cpf = watch("cpf");
  const cnpj = watch("cnpj");

  // Apply masks
  useEffect(() => {
    if (phone) {
      const cleaned = phone.replace(/\D/g, "");
      const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
      if (match) {
        setValue("phone", `(${match[1]}) ${match[2]}-${match[3]}`);
      }
    }
  }, [phone, setValue]);

  useEffect(() => {
    if (alternativePhone) {
      const cleaned = alternativePhone.replace(/\D/g, "");
      const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
      if (match) {
        setValue("alternativePhone", `(${match[1]}) ${match[2]}-${match[3]}`);
      }
    }
  }, [alternativePhone, setValue]);

  useEffect(() => {
    if (cpf) {
      const cleaned = cpf.replace(/\D/g, "");
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
      if (match) {
        setValue("cpf", `${match[1]}.${match[2]}.${match[3]}-${match[4]}`);
      }
    }
  }, [cpf, setValue]);

  useEffect(() => {
    if (cnpj) {
      const cleaned = cnpj.replace(/\D/g, "");
      const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);
      if (match) {
        setValue(
          "cnpj",
          `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`
        );
      }
    }
  }, [cnpj, setValue]);

  const onSubmit = async (data: OwnerFormData) => {
    try {
      // Clean up formatted values before submission
      const cleanedData = {
        ...data,
        phone: data.phone.replace(/\D/g, ""),
        alternativePhone: data.alternativePhone?.replace(/\D/g, ""),
        cpf: data.cpf?.replace(/\D/g, ""),
        cnpj: data.cnpj?.replace(/\D/g, ""),
      };

      if (owner) {
        await updateOwner(organizationId, owner.id, cleanedData);
        showToast("Proprietário atualizado com sucesso", { variant: "success" });
      } else {
        await createOwner(organizationId, cleanedData);
        showToast("Proprietário criado com sucesso", { variant: "success" });
      }
      router.push(`/app/${organizationId}/properties/owners`);
      router.refresh();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao salvar proprietário",
        { variant: "error" }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Nome completo"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="email@exemplo.com"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="(00) 00000-0000"
            maxLength={15}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="alternativePhone">Telefone Alternativo</Label>
          <Input
            id="alternativePhone"
            {...register("alternativePhone")}
            placeholder="(00) 00000-0000"
            maxLength={15}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            {...register("cpf")}
            placeholder="000.000.000-00"
            maxLength={14}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            {...register("cnpj")}
            placeholder="00.000.000/0000-00"
            maxLength={18}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Informações adicionais sobre o proprietário"
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : owner ? "Atualizar" : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
}