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

interface SeasonRentFeatures {
  rooms: string;
  bathrooms?: string;
  garage_spaces?: string;
  beds: string;
  size?: string;
  rent_type?: string;
  season_type: string;
  season_features?: string[];
}

interface SeasonRentTabProps {
  features: Partial<SeasonRentFeatures>;
  onChange: (features: Partial<SeasonRentFeatures>) => void;
}

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

const BEDS_OPTIONS = [
  { value: "1", label: "1 cama" },
  { value: "2", label: "2 camas" },
  { value: "3", label: "3 camas" },
  { value: "4", label: "4 camas" },
  { value: "5", label: "5 camas" },
  { value: "6", label: "6 camas" },
  { value: "7", label: "7 camas" },
  { value: "8", label: "8 camas" },
  { value: "9", label: "9 camas" },
  { value: "10", label: "10 camas" },
  { value: "11", label: "11 camas" },
  { value: "12", label: "12 camas" },
  { value: "13", label: "13 camas" },
  { value: "14", label: "14 camas" },
  { value: "15", label: "15 camas" },
  { value: "16", label: "20 camas" },
  { value: "17", label: "25 camas" },
  { value: "18", label: "30 ou mais camas" },
];

const SEASON_TYPES = [
  { value: "1", label: "Apartamento" },
  { value: "2", label: "Casa" },
  { value: "3", label: "Quarto individual" },
  { value: "4", label: "Quarto compartilhado" },
  { value: "5", label: "Hotel, hostel e pousada" },
  { value: "6", label: "Sítio, fazenda e chácara" },
];

const RENT_TYPES = [
  { value: "1", label: "Por dia" },
  { value: "2", label: "Por semana" },
  { value: "3", label: "Por mês" },
  { value: "4", label: "Pacote" },
];

const SEASON_FEATURES = [
  { value: "1", label: "Ar condicionado" },
  { value: "2", label: "Aquecimento" },
  { value: "3", label: "Café da manhã" },
  { value: "4", label: "Churrasqueira" },
  { value: "5", label: "Estacionamento" },
  { value: "6", label: "Fogão" },
  { value: "7", label: "Geladeira" },
  { value: "8", label: "Internet" },
  { value: "9", label: "Lareira" },
  { value: "10", label: "Máquina de lavar" },
  { value: "11", label: "Permitido animais" },
  { value: "12", label: "Piscina" },
  { value: "13", label: "Roupa de cama" },
  { value: "14", label: "Toalhas" },
  { value: "15", label: "TV a cabo" },
  { value: "16", label: "Ventilador" },
  { value: "17", label: "Varanda/Terraço" },
];

export function SeasonRentTab({ features, onChange }: SeasonRentTabProps) {
  const updateFeature = (key: keyof SeasonRentFeatures, value: any) => {
    onChange({ ...features, [key]: value });
  };

  const toggleArrayFeature = (key: "season_features", value: string) => {
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
          <Label>Tipo de Imóvel *</Label>
          <Select
            value={features.season_type}
            onValueChange={(value) => updateFeature("season_type", value)}
          >
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
        </div>

        <div className="space-y-2">
          <Label>Tipo de Pagamento</Label>
          <Select
            value={features.rent_type}
            onValueChange={(value) => updateFeature("rent_type", value)}
          >
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
          <Label>Camas *</Label>
          <Select
            value={features.beds}
            onValueChange={(value) => updateFeature("beds", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a quantidade" />
            </SelectTrigger>
            <SelectContent>
              {BEDS_OPTIONS.map(({ value, label }) => (
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
      </div>

      <div>
        <Label>Detalhes do Imóvel</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          {SEASON_FEATURES.map(({ value, label }) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={`season-feature-${value}`}
                checked={(features.season_features || []).includes(value)}
                onCheckedChange={() =>
                  toggleArrayFeature("season_features", value)
                }
              />
              <label
                htmlFor={`season-feature-${value}`}
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