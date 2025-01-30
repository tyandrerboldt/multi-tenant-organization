"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface RoomRentFeatures {
  room_rent_features?: string[];
}

interface RoomRentTabProps {
  features: Partial<RoomRentFeatures>;
  onChange: (features: Partial<RoomRentFeatures>) => void;
}

const ROOM_RENT_FEATURES = [
  { value: "1", label: "Armário no quarto" },
  { value: "2", label: "Banheiro no quarto" },
  { value: "3", label: "Mobiliado" },
  { value: "4", label: "Ar condicionado" },
  { value: "5", label: "Varanda" },
  { value: "6", label: "Aquecimento" },
  { value: "7", label: "Internet" },
  { value: "8", label: "TV a cabo" },
];

export function RoomRentTab({ features, onChange }: RoomRentTabProps) {
  const toggleArrayFeature = (key: "room_rent_features", value: string) => {
    const currentValues = features[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    onChange({ ...features, [key]: newValues });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Detalhes do Quarto</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {ROOM_RENT_FEATURES.map(({ value, label }) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={`room-feature-${value}`}
                checked={(features.room_rent_features || []).includes(value)}
                onCheckedChange={() =>
                  toggleArrayFeature("room_rent_features", value)
                }
              />
              <label
                htmlFor={`room-feature-${value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}