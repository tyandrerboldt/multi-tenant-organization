"use client";

import {
  LandFeaturesFormData,
  landFeaturesSchema,
} from "@/app/app/[slug]/properties/[code]/features/_schemas/land";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LAND_FEATURES, LAND_TYPES } from "@/domain/data/property-features";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface LandTabProps {
  features: Partial<LandFeaturesFormData>;
  onSubmit: (data: LandFeaturesFormData) => Promise<void>;
}

export function LandTab({ features, onSubmit }: LandTabProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<LandFeaturesFormData>({
    resolver: zodResolver(landFeaturesSchema),
    defaultValues: {
      reLandType: features?.reLandType || "",
      size: features?.size || 0,
      reLandFeatures: features?.reLandFeatures || [],
      iptu: features?.iptu || 0,
      condominio: features?.condominio || 0,
    },
  });

  useEffect(() => {
    if (features) {
      reset(features);
    }
  }, [features, reset]);

  const onSubmitForm = handleSubmit(async (data) => {
    await onSubmit(data);
    reset(data);
  });

  return (
    <form onSubmit={onSubmitForm} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Tipo de Área *</Label>
          <Controller
            name="reLandType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {LAND_TYPES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.reLandType && (
            <p className="text-sm text-destructive">
              {errors.reLandType.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Área (m²)</Label>
          <Input type="number" {...register("size")} placeholder="1000" />
          {errors.size && (
            <p className="text-sm text-destructive">{errors.size.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>IPTU Mensal (R$)</Label>
          <Input
            type="number"
            {...register("iptu")}
            placeholder="0.00"
            step="0.01"
          />
          {errors.iptu && (
            <p className="text-sm text-destructive">{errors.iptu.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Valor do Condomínio (R$)</Label>
          <Input
            type="number"
            {...register("condominio")}
            placeholder="0.00"
            step="0.01"
          />
          {errors.condominio && (
            <p className="text-sm text-destructive">
              {errors.condominio.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label>Detalhes do Imóvel</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <Controller
            name="reLandFeatures"
            control={control}
            render={({ field }) => (
              <>
                {LAND_FEATURES.map(({ value, label }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`land-feature-${value}`}
                      checked={field.value.includes(value)}
                      onCheckedChange={(checked) => {
                        const updatedFeatures = checked
                          ? [...field.value, value]
                          : field.value.filter((v) => v !== value);
                        field.onChange(updatedFeatures);
                      }}
                    />
                    <label
                      htmlFor={`land-feature-${value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {label}
                    </label>
                  </div>
                ))}
              </>
            )}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? "Salvando..." : "Salvar características"}
        </Button>
      </div>
    </form>
  );
}
