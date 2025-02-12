"use client";

import { CapturerSelect } from "@/components/properties/capturer-select";
import { OwnerSelect } from "@/components/properties/owner-select";
import { CurrencyInput } from "@/components/shared/currency-input";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createProperty,
  updatePropertyGeneral,
} from "@/lib/actions/properties";
import { showToast } from "@/lib/toast";
import {
  HighlightStatus,
  PropertySituation,
  PropertyType,
  Status,
  highlightStatusLabels,
  propertySituationLabels,
  propertyTypeLabels,
  statusLabels,
} from "@/lib/types/properties";
import { cn } from "@/lib/utils";
import { PropertyFormData, propertySchema } from "@/lib/validations/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { Property } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface GeneralFormProps {
  organizationId: string;
  organizationSlug: string;
  initialData?: Property;
  onPropertyChange?: (data: Property) => void;
}

export function GeneralForm({
  organizationId,
  organizationSlug,
  initialData,
  onPropertyChange,
}: GeneralFormProps) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | undefined>(initialData);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      code: property?.code || "",
      name: property?.name || "",
      type: property?.type || PropertyType.HOUSE,
      status: property?.status || Status.DRAFT,
      highlight: property?.highlight || HighlightStatus.NORMAL,
      situation: property?.situation || PropertySituation.GOOD,
      description: property?.description || "",
      ownerId: property?.ownerId || "",
      capturerId: property?.capturerId || "",
      categoryId: property?.categoryId || 1,
      saleValue: Number(property?.saleValue) || 0,
      rentalValue: Number(property?.rentalValue) || 0,
      enableRent: property?.enableRent || false,
      enableSale: property?.enableSale || false,
    },
  });

  // Watch for enableRent and enableSale values
  const enableRent = watch("enableRent");
  const enableSale = watch("enableSale");

  useEffect(() => {
    if (property) {
      reset(property);
    }
  }, [property, reset]);

  const onSubmit = async (data: PropertyFormData) => {
    try {
      if (property) {
        const result = await updatePropertyGeneral(
          organizationId,
          property.id,
          data
        );
        if (result.success) {
          setProperty(result.property);
          onPropertyChange && onPropertyChange(result.property);
          showToast("Imóvel atualizado com sucesso", { variant: "success" });
          reset(data);
        }
      } else {
        const result = await createProperty(organizationId, data);
        if (result.success) {
          showToast("Imóvel criado com sucesso", { variant: "success" });
          router.push(
            `/app/${organizationSlug}/properties/${result.property.code}`
          );
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="code">Código *</Label>
          <Input
            id="code"
            {...register("code")}
            placeholder="Código do imóvel"
          />
          {errors.code && (
            <p className="text-sm text-destructive">{errors.code.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input id="name" {...register("name")} placeholder="Nome do imóvel" />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Proprietário *</Label>
          <Controller
            name="ownerId"
            control={control}
            render={({ field }) => (
              <OwnerSelect
                organizationId={organizationId}
                value={field.value}
                onChange={(val) => field.onChange(val)}
              />
            )}
          />
          {errors.ownerId && (
            <p className="text-sm text-destructive">{errors.ownerId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Captador</Label>
          <Controller
            name="capturerId"
            control={control}
            render={({ field }) => (
              <CapturerSelect
                organizationId={organizationId}
                value={field.value}
                onChange={(val) => field.onChange(val)}
              />
            )}
          />
          {errors.ownerId && (
            <p className="text-sm text-destructive">{errors.ownerId.message}</p>
          )}
        </div>
      </div>

      {/* Property Classification */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <Label>Tipo *</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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
            )}
          />
          {errors.type && (
            <p className="text-sm text-destructive">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Status *</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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
            )}
          />
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Situação *</Label>
          <Controller
            name="situation"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a situação" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(propertySituationLabels).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.situation && (
            <p className="text-sm text-destructive">
              {errors.situation.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Destaque</Label>
          <Controller
            name="highlight"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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
            )}
          />
          {errors.highlight && (
            <p className="text-sm text-destructive">
              {errors.highlight.message}
            </p>
          )}
        </div>
      </div>

      {/* Pricing Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            <Label htmlFor="enableSale" className="font-medium">
              Disponível para Venda
            </Label>
            <Controller
              name="enableSale"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="saleValue">Valor de venda</Label>
            <Controller
              name="saleValue"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value || 0}
                  onChange={field.onChange}
                  className={cn(errors.saleValue && "border-red-500")}
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            <Label htmlFor="enableRent" className="font-medium">
              Disponível para Locação
            </Label>
            <Controller
              name="enableRent"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rentalValue">Valor de Locação</Label>
            <Controller
              name="rentalValue"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value || 0}
                  onChange={field.onChange}
                  className={cn(errors.saleValue && "border-red-500")}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição *</Label>
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
