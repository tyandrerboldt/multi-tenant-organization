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
  SEASON_TYPES,
  RENT_TYPES,
  ROOM_OPTIONS,
  BEDS_OPTIONS,
  BATHROOM_OPTIONS,
  GARAGE_OPTIONS,
  SEASON_FEATURES,
} from "@/domain/data/property-features";
import {
  SeasonRentFeaturesFormData,
  seasonRentFeaturesSchema,
} from "@/app/app/[slug]/properties/[code]/features/_schemas/season-rent";

interface SeasonRentTabProps {
  features: Partial<SeasonRentFeaturesFormData>;
  onSubmit: (data: SeasonRentFeaturesFormData) => Promise<void>;
}

export function SeasonRentTab({ features, onSubmit }: SeasonRentTabProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<SeasonRentFeaturesFormData>({
    resolver: zodResolver(seasonRentFeaturesSchema),
    defaultValues: {
      seasonType: features?.seasonType || "",
      rentType: features?.rentType || "",
      rooms: features?.rooms || 0,
      beds: features?.beds || 0,
      bathrooms: features?.bathrooms || 0,
      garageSpaces: features?.garageSpaces || 0,
      size: features?.size || 0,
      seasonFeatures: features?.seasonFeatures || [],
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
          <Label>Tipo de Imóvel *</Label>
          <Controller
            name="seasonType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {SEASON_TYPES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.seasonType && (
            <p className="text-sm text-destructive">
              {errors.seasonType.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Tipo de Pagamento</Label>
          <Controller
            name="rentType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {RENT_TYPES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Quartos *</Label>
          <Input type="number" {...register("rooms")} placeholder="1" />
          {errors.rooms && (
            <p className="text-sm text-destructive">{errors.rooms.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Camas</Label>
          <Input type="number" {...register("beds")} placeholder="1" />
          {errors.beds && (
            <p className="text-sm text-destructive">{errors.beds.message}</p>
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
      </div>

      <div>
        <Label>Detalhes do Imóvel</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          <Controller
            name="seasonFeatures"
            control={control}
            render={({ field }) => (
              <>
                {SEASON_FEATURES.map(({ value, label }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`season-feature-${value}`}
                      checked={field.value.includes(value)}
                      onCheckedChange={(checked) => {
                        const updatedFeatures = checked
                          ? [...field.value, value]
                          : field.value.filter((v) => v !== value);
                        field.onChange(updatedFeatures);
                      }}
                    />
                    <label
                      htmlFor={`season-feature-${value}`}
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
