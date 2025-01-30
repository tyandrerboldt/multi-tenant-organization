"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface LandFeatures {
  size?: string;
  re_land_type: string;
  re_land_features?: string[];
  iptu?: string;
  condominio?: string;
}

interface LandTabProps {
  features: Partial<LandFeatures>;
  onChange: (features: Partial<LandFeatures>) => void;
}

const LAND_TYPES = [
  { value: "1", label: "Terrenos e lotes" },
  { value: "2", label: "Sítios e chácaras" },
  { value: "3", label: "Fazendas" },
  { value: "4", label: "Outros" },
];

const LAND_FEATURES = [
  { value: "1", label: "Área verde" },
  { value: "2", label: "Casa sede" },
  { value: "3", label: "Pomar" },
  { value: "4", label: "Piscina" },
  { value: "5", label: "Churrasqueira" },
  { value: "6", label: "Poço artesiano" },
  { value: "7", label: "Água encanada" },
  { value: "8", label: "Energia elétrica" },
  { value: "9", label: "Campo de futebol" },
  { value: "10", label: "Acesso asfaltado" },
];

export function LandTab({ features, onChange }: LandTabProps) {
  const updateFeature = (key: keyof LandFeatures, value: any) => {
    onChange({ ...features, [key]: value });
  };

  const toggleArrayFeature = (key: "re_land_features", value: string) => {
    const currentValues = features[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    updateFeature(key, newValues);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Tipo de Área *</Label>
          <Select
            value={features.re_land_type}
            onValueChange={(value) => updateFeature("re_land_type", value)}
          >
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
        </div>

        <div className="space-y-2">
          <Label>Área (m²)</Label>
          <Input
            type="number"
            value={features.size}
            onChange={(e) => updateFeature("size", e.target.value)}
            placeholder="1000"
          />
        </div>

        <div className="space-y-2">
          <Label>IPTU Mensal (R$)</Label>
          <Input
            type="number"
            value={features.iptu}
            onChange={(e) => updateFeature("iptu", e.target.value)}
            placeholder="0.00"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label>Valor do Condomínio (R$)</Label>
          <Input
            type="number"
            value={features.condominio}
            onChange={(e) => updateFeature("condominio", e.target.value)}
            placeholder="0.00"
            step="0.01"
          />
        </div>
      </div>

      <div>
        <Label>Detalhes do Imóvel</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {LAND_FEATURES.map(({ value, label }) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={`land-feature-${value}`}
                checked={(features.re_land_features || []).includes(value)}
                onCheckedChange={() =>
                  toggleArrayFeature("re_land_features", value)
                }
              />
              <label
                htmlFor={`land-feature-${value}`}
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