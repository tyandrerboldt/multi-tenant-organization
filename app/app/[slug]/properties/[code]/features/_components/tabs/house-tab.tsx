"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  HOME_TYPES,
  ROOM_OPTIONS,
  BATHROOM_OPTIONS,
  GARAGE_OPTIONS,
  HOME_FEATURES,
  HOME_COMPLEX_FEATURES,
} from "@/domain/data/property-features";
import {
  HouseFeaturesFormData,
  houseFeaturesSchema,
} from "@/app/app/[slug]/properties/[code]/features/_schemas/house";

interface HouseTabProps {
  features: Partial<HouseFeaturesFormData>;
  onSubmit: (data: HouseFeaturesFormData) => Promise<void>;
}

export function HouseTab({ features, onSubmit }: HouseTabProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<HouseFeaturesFormData>({
    resolver: zodResolver(houseFeaturesSchema),
    defaultValues: {
      homeType: features?.homeType || "",
      rooms: features?.rooms || 0,
      bathrooms: features?.bathrooms || 0,
      garageSpaces: features?.garageSpaces || 0,
      size: features?.size || 0,
      homeFeatures: features?.homeFeatures || [],
      homeComplexFeatures: features?.homeComplexFeatures || [],
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
          <Label>Tipo da Casa *</Label>
          <Controller
            name="homeType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {HOME_TYPES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.homeType && (
            <p className="text-sm text-destructive">
              {errors.homeType.message}
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
              name="homeFeatures"
              control={control}
              render={({ field }) => (
                <>
                  {HOME_FEATURES.map(({ value, label }) => (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`home-feature-${value}`}
                        checked={field.value.includes(value)}
                        onCheckedChange={(checked) => {
                          const updatedFeatures = checked
                            ? [...field.value, value]
                            : field.value.filter((v) => v !== value);
                          field.onChange(updatedFeatures);
                        }}
                      />
                      <label
                        htmlFor={`home-feature-${value}`}
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
              name="homeComplexFeatures"
              control={control}
              render={({ field }) => (
                <>
                  {HOME_COMPLEX_FEATURES.map(({ value, label }) => (
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
