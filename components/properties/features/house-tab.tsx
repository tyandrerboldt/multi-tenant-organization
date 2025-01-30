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

interface HouseFeatures {
  rooms: string;
  bathrooms?: string;
  garage_spaces?: string;
  size?: string;
  home_type: string;
  home_features?: string[];
  home_complex_features?: string[];
  iptu?: string;
  condominio?: string;
}

interface HouseTabProps {
  features: Partial<HouseFeatures>;
  onChange: (features: Partial<HouseFeatures>) => void;
}

const HOME_TYPES = [
  { value: "1", label: "Padrão" },
  { value: "2", label: "Casa de vila" },
  { value: "3", label: "Casa de condomínio" },
];

const ROOM_OPTIONS = [
  { value: "0", label: "0 quartos" },
  { value: "1", label: "1 quarto" },
  { value: "2", label: "2 quartos" },
  { value: "3", label: "3 quartos" },
  { value: "4", label: "4 quartos" },
  { value: "5", label: "5 ou mais quartos" },
];

const BATHROOM_OPTIONS = [
  { value: "1", label: "1 banheiro" },
  { value: "2", label: "2 banheiros" },
  { value: "3", label: "3 banheiros" },
  { value: "4", label: "4 banheiros" },
  { value: "5", label: "5 ou mais banheiros" },
];

const GARAGE_OPTIONS = [
  { value: "0", label: "0 vagas" },
  { value: "1", label: "1 vaga" },
  { value: "2", label: "2 vagas" },
  { value: "3", label: "3 vagas" },
  { value: "4", label: "4 vagas" },
  { value: "5", label: "5 ou mais vagas" },
];

const HOME_FEATURES = [
  { value: "1", label: "Ar condicionado" },
  { value: "2", label: "Piscina" },
  { value: "3", label: "Armários no quarto" },
  { value: "4", label: "Varanda" },
  { value: "5", label: "Área de serviço" },
  { value: "6", label: "Churrasqueira" },
  { value: "7", label: "Quarto de serviço" },
  { value: "8", label: "Porteiro 24h" },
  { value: "9", label: "Armários na cozinha" },
  { value: "10", label: "Mobiliado" },
];

const COMPLEX_FEATURES = [
  { value: "1", label: "Condomínio fechado" },
  { value: "2", label: "Segurança 24h" },
  { value: "3", label: "Área murada" },
  { value: "4", label: "Permitido animais" },
  { value: "5", label: "Portão eletrônico" },
  { value: "6", label: "Academia" },
  { value: "9", label: "Piscina" },
];

export function HouseTab({ features, onChange }: HouseTabProps) {
  const updateFeature = (key: keyof HouseFeatures, value: any) => {
    onChange({ ...features, [key]: value });
  };

  const toggleArrayFeature = (
    key: "home_features" | "home_complex_features",
    value: string
  ) => {
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
          <Label>Tipo da Casa *</Label>
          <Select
            value={features.home_type}
            onValueChange={(value) => updateFeature("home_type", value)}
          >
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
        </div>

        <div className="space-y-2">
          <Label>Quartos *</Label>
          <Select
            value={features.rooms}
            onValueChange={(value) => updateFeature("rooms", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a quantidade" />
            </SelectTrigger>
            <SelectContent>
              {ROOM_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Banheiros</Label>
          <Select
            value={features.bathrooms}
            onValueChange={(value) => updateFeature("bathrooms", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a quantidade" />
            </SelectTrigger>
            <SelectContent>
              {BATHROOM_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Vagas de Garagem</Label>
          <Select
            value={features.garage_spaces}
            onValueChange={(value) => updateFeature("garage_spaces", value)}
          >
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
        </div>

        <div className="space-y-2">
          <Label>Área (m²)</Label>
          <Input
            type="number"
            value={features.size}
            onChange={(e) => updateFeature("size", e.target.value)}
            placeholder="100"
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

      <div className="space-y-4">
        <div>
          <Label>Detalhes do Imóvel</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {HOME_FEATURES.map(({ value, label }) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`home-feature-${value}`}
                  checked={(features.home_features || []).includes(value)}
                  onCheckedChange={() =>
                    toggleArrayFeature("home_features", value)
                  }
                />
                <label
                  htmlFor={`home-feature-${value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Detalhes do Condomínio</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {COMPLEX_FEATURES.map(({ value, label }) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`complex-feature-${value}`}
                  checked={(features.home_complex_features || []).includes(value)}
                  onCheckedChange={() =>
                    toggleArrayFeature("home_complex_features", value)
                  }
                />
                <label
                  htmlFor={`complex-feature-${value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}