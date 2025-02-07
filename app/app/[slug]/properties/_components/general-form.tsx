"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OwnerSelect } from "@/components/properties/owner-select";
import { useProperty } from "./property-context";
import { PropertyFormData, propertySchema } from "@/lib/validations/properties";
import { createProperty, updatePropertyGeneral } from "@/lib/actions/properties";
import { showToast } from "@/lib/toast";
import { HighlightStatus, PropertyType, Status, highlightStatusLabels, propertyTypeLabels, statusLabels } from "@/lib/types/properties";
import { useEffect } from "react";

interface GeneralFormProps {
  organizationId: string;
  organizationSlug: string;
}

export function GeneralForm({ organizationId, organizationSlug }: GeneralFormProps) {
  const router = useRouter();
  const { property, setProperty, setIsDirty } = useProperty();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: property || undefined,
  });

  // Update isDirty in context when form state changes
  useEffect(() => {
    setIsDirty(isDirty);
  }, [isDirty, setIsDirty]);

  // Reset form when property changes
  useEffect(() => {
    if (property) {
      reset(property);
    }
  }, [property, reset]);

  const onSubmit = async (data: PropertyFormData) => {
    try {
      if (property) {
        // Update existing property
        const result = await updatePropertyGeneral(organizationId, property.id, data);
        if (result.success) {
          setProperty(result.property);
          showToast("Imóvel atualizado com sucesso", { variant: "success" });
          setIsDirty(false);
        }
      } else {
        // Create new property
        const result = await createProperty(organizationId, data);
        if (result.success) {
          showToast("Imóvel criado com sucesso", { variant: "success" });
          router.push(`/app/${organizationSlug}/properties/${result.property.code}`);
        }
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao salvar imóvel",
        { variant: "error" }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="code">Código</Label>
          <Input
            id="code"
            {...register("code")}
            placeholder="Código do imóvel"
          />
          {errors.code && (
            <p className="text-sm text-destructive">
              {errors.code.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Nome do imóvel"
          />
          {errors.name && (
            <p className="text-sm text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select
            onValueChange={(value) =>
              setValue("type", value as PropertyType)
            }
            defaultValue={watch("type")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(propertyTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-destructive">
              {errors.type.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            onValueChange={(value) => setValue("status", value as Status)}
            defaultValue={watch("status")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-destructive">
              {errors.status.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Destaque</Label>
          <Select
            onValueChange={(value) =>
              setValue("highlight", value as HighlightStatus)
            }
            defaultValue={watch("highlight")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o destaque" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(highlightStatusLabels).map(
                ([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          {errors.highlight && (
            <p className="text-sm text-destructive">
              {errors.highlight.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Proprietário *</Label>
          <OwnerSelect
            organizationId={organizationId}
            value={watch("ownerId")}
            onChange={(value) => setValue("ownerId", value)}
          />
          {errors.ownerId && (
            <p className="text-sm text-destructive">
              {errors.ownerId.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Descreva o imóvel"
          className="min-h-[150px]"
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}