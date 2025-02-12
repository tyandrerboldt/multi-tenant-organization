"use client";

import {
  CommercialFeaturesFormData,
  commercialFeaturesSchema,
} from "@/app/app/[slug]/properties/[code]/features/_schemas/commercial";
import { CurrencyInput } from "@/components/shared/currency-input";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface CommercialTabProps {
  features: Partial<CommercialFeaturesFormData>;
  onSubmit: (data: CommercialFeaturesFormData) => Promise<void>;
}

export function CommercialTab({ features, onSubmit }: CommercialTabProps) {
  const router = useRouter();

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
      size: features?.size || 0,
      garageSpaces: features?.garageSpaces || 0,
      commercialFeatures: features?.commercialFeatures || [],
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
            <Input
              type="number"
              {...register("garageSpaces")}
              placeholder="1"
            />
            {errors.garageSpaces && (
              <p className="text-sm text-destructive">
                {errors.garageSpaces.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="iptu">IPTU Mensal</Label>
            <Controller
              name="iptu"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value || 0}
                  onChange={field.onChange}
                  className={cn(errors.iptu && "border-red-500")}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condominio">Valor do condomínio</Label>
            <Controller
              name="condominio"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value || 0}
                  onChange={field.onChange}
                  className={cn(errors.condominio && "border-red-500")}
                />
              )}
            />
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
