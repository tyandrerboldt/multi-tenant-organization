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

interface CommercialFeatures {
  size?: string;
  commercial_type?: string;
  garage_spaces?: string;
  commercial_features?: string[];
  iptu?: string;
  condominio?: string;
}

interface CommercialTabProps {
  features: Partial<CommercialFeatures>;
  onChange: (features: Partial<CommercialFeatures>) => void;
}

const COMMERCIAL_TYPES = [
  { value: "1", label: "Escritório" },
  { value: "2", label: "Galpão/Depósito" },
  { value: "3", label: "Hotel" },
  { value: "4", label: "Fábrica" },
  { value: "5", label: "Garagem/Vaga" },
  { value: "6", label: "Loja" },
  { value: "7", label: "Outros" },
];

const COMMERCIAL_FEATURES = [
  { value: "1", label: "Garagem" },
  { value: "2", label: "Segurança 24h" },
  { value: "3", label: "Câmeras de segurança" },
  { value: "4", label: "Elevador" },
  { value: "5", label: "Portaria" },
  { value: "6", label: "Acesso para deficientes" },
];

const GARAGE_OPTIONS = [
  { value: "0", label: "0 vagas" },
  { value: "1", label: "1 vaga" },
  { value: "2", label: "2 vagas" },
  { value: "3", label: "3 vagas" },
  { value: "4", label: "4 vagas" },
  { value: "5", label: "5 ou mais vagas" },
];


export function CommercialTab({ features, onChange }: CommercialTabProps) {
  const updateFeature = (key: keyof CommercialFeatures, value: any) => {
    onChange({ ...features, [key]: value });
  };

  const toggleArrayFeature = (key: "commercial_features", value: string) => {
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
          <Label>Tipo de Imóvel Comercial</Label>
          <Select
            value={features.commercial_type}
            onValueChange={(value) => updateFeature("commercial_type", value)}
          >
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
      </div>

      <div>
        <Label>Detalhes do Imóvel</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          {COMMERCIAL_FEATURES.map(({ value, label }) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={`commercial-feature-${value}`}
                checked={(features.commercial_features || []).includes(value)}
                onCheckedChange={() =>
                  toggleArrayFeature("commercial_features", value)
                }
              />
              <label
                htmlFor={`commercial-feature-${value}`}
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