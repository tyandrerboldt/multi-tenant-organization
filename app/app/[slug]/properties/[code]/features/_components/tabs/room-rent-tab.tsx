"use client";

import {
  RoomRentFeaturesFormData,
  roomRentFeaturesSchema,
} from "@/app/app/[slug]/properties/[code]/features/_schemas/room-rent";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ROOM_RENT_FEATURES } from "@/domain/data/property-features";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface RoomRentTabProps {
  features: Partial<RoomRentFeaturesFormData>;
  onSubmit: (data: RoomRentFeaturesFormData) => Promise<void>;
}

export function RoomRentTab({ features, onSubmit }: RoomRentTabProps) {
  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting },
    reset,
  } = useForm<RoomRentFeaturesFormData>({
    resolver: zodResolver(roomRentFeaturesSchema),
    defaultValues: {
      roomRentFeatures: features?.roomRentFeatures || [],
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
      <div>
        <Label>Detalhes do Quarto</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <Controller
            name="roomRentFeatures"
            control={control}
            render={({ field }) => (
              <>
                {ROOM_RENT_FEATURES.map(({ value, label }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`room-feature-${value}`}
                      checked={field.value.includes(value)}
                      onCheckedChange={(checked) => {
                        const updatedFeatures = checked
                          ? [...field.value, value]
                          : field.value.filter((v) => v !== value);
                        field.onChange(updatedFeatures);
                      }}
                    />
                    <label
                      htmlFor={`room-feature-${value}`}
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
