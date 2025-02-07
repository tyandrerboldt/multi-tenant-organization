"use client";

import {
  CommercialFeaturesFormData,
  commercialFeaturesSchema,
} from "@/app/app/[slug]/properties/[code]/features/_schemas";
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
import {
  COMMERCIAL_FEATURES,
  COMMERCIAL_TYPES,
  GARAGE_OPTIONS,
} from "@/domain/data/property-features";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface CommercialTabProps {
  features: Partial<CommercialFeaturesFormData>;
  onSubmit: (data: CommercialFeaturesFormData) => Promise<void>;
}

export function CommercialTab({ features, onSubmit }: CommercialTabProps) {
  const router = useRouter();
  const [showPendingChanges, setShowPendingChanges] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<CommercialFeaturesFormData>({
    resolver: zodResolver(commercialFeaturesSchema),
    defaultValues: {
      commercialType: features?.commercialType || "",
      size: features?.size || "",
      garageSpaces: features?.garageSpaces || "",
      commercialFeatures: features?.commercialFeatures || [],
      iptu: features?.iptu || "",
      condominio: features?.condominio || "",
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
    <>
      <form onSubmit={onSubmitForm} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Tipo de Imóvel Comercial</Label>
            <Controller
              name="commercialType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMERCIAL_TYPES.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.commercialType && (
              <p className="text-sm text-destructive">
                {errors.commercialType.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Área (m²)</Label>
            <Input type="number" {...register("size")} placeholder="100" />
            {errors.size && (
              <p className="text-sm text-destructive">{errors.size.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Vagas de Garagem</Label>
            <Controller
              name="garageSpaces"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a quantidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {GARAGE_OPTIONS.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.garageSpaces && (
              <p className="text-sm text-destructive">
                {errors.garageSpaces.message}
              </p>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            <Controller
              name="commercialFeatures"
              control={control}
              render={({ field }) => (
                <>
                  {COMMERCIAL_FEATURES.map(({ value, label }) => (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`commercial-feature-${value}`}
                        checked={field.value.includes(value)}
                        onCheckedChange={(checked) => {
                          const updatedFeatures = checked
                            ? [...field.value, value]
                            : field.value.filter((v) => v !== value);
                          field.onChange(updatedFeatures);
                        }}
                      />
                      <label
                        htmlFor={`commercial-feature-${value}`}
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
          {errors.commercialFeatures && (
            <p className="text-sm text-destructive mt-2">
              {errors.commercialFeatures.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? "Salvando..." : "Salvar características"}
          </Button>
        </div>
      </form>
    </>
  );
}
