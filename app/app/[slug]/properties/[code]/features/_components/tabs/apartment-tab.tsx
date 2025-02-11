"use client";

import {
  ApartmentFeaturesFormData,
  apartmentFeaturesSchema,
} from "@/app/app/[slug]/properties/[code]/features/_schemas/apartment";
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
  APARTMENT_COMPLEX_FEATURES,
  APARTMENT_FEATURES,
  APARTMENT_TYPES,
} from "@/domain/data/property-features";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface ApartmentTabProps {
  features: Partial<ApartmentFeaturesFormData>;
  onSubmit: (data: ApartmentFeaturesFormData) => Promise<void>;
}

export function ApartmentTab({ features, onSubmit }: ApartmentTabProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<ApartmentFeaturesFormData>({
    resolver: zodResolver(apartmentFeaturesSchema),
    defaultValues: {
      apartmentType: features?.apartmentType || "",
      rooms: features?.rooms || 0,
      bathrooms: features?.bathrooms || 0,
      garageSpaces: features?.garageSpaces || 0,
      size: features?.size || 0,
      apartmentFeatures: features?.apartmentFeatures || [],
      apartmentComplexFeatures: features?.apartmentComplexFeatures || [],
      iptu: features?.iptu || undefined,
      condominio: features?.condominio || undefined,
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
          <Label>Tipo do Apartamento *</Label>
          <Controller
            name="apartmentType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {APARTMENT_TYPES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.apartmentType && (
            <p className="text-sm text-destructive">
              {errors.apartmentType.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Quartos *</Label>
          <Input type="number" {...register("rooms")} placeholder="1" />
          {errors.rooms && (
            <p className="text-sm text-destructive">{errors.rooms.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Banheiros</Label>
          <Input type="number" {...register("bathrooms")} placeholder="1" />
          {errors.bathrooms && (
            <p className="text-sm text-destructive">
              {errors.bathrooms.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Vagas de Garagem</Label>
          <Input type="number" {...register("garageSpaces")} placeholder="1" />
          {errors.garageSpaces && (
            <p className="text-sm text-destructive">
              {errors.garageSpaces.message}
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

      <div className="space-y-4">
        <div>
          <Label>Detalhes do Imóvel</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <Controller
              name="apartmentFeatures"
              control={control}
              render={({ field }) => (
                <>
                  {APARTMENT_FEATURES.map(({ value, label }) => (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`apartment-feature-${value}`}
                        checked={field.value.includes(value)}
                        onCheckedChange={(checked) => {
                          const updatedFeatures = checked
                            ? [...field.value, value]
                            : field.value.filter((v) => v !== value);
                          field.onChange(updatedFeatures);
                        }}
                      />
                      <label
                        htmlFor={`apartment-feature-${value}`}
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

        <div>
          <Label>Detalhes do Condomínio</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <Controller
              name="apartmentComplexFeatures"
              control={control}
              render={({ field }) => (
                <>
                  {APARTMENT_COMPLEX_FEATURES.map(({ value, label }) => (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`complex-feature-${value}`}
                        checked={field.value.includes(value)}
                        onCheckedChange={(checked) => {
                          const updatedFeatures = checked
                            ? [...field.value, value]
                            : field.value.filter((v) => v !== value);
                          field.onChange(updatedFeatures);
                        }}
                      />
                      <label
                        htmlFor={`complex-feature-${value}`}
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
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? "Salvando..." : "Salvar características"}
        </Button>
      </div>
    </form>
  );
}
