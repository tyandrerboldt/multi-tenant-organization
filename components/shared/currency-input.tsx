import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type CurrencyInputProps = {
  value: number;
  onChange: (value: number) => void;
  className?: string;
};

export function CurrencyInput({
  value,
  onChange,
  className,
}: CurrencyInputProps) {
  
  const formatCurrency = (value: number | string) => {
    const numericValue =
      typeof value === "number"
        ? value
        : parseFloat(value.replace(/[^0-9,-]+/g, "").replace(",", "."));
    if (isNaN(numericValue)) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  const parseCurrency = (value: string) => {
    return value.replace(/\D/g, "");
  };

  return (
    <Input
      value={formatCurrency(value)}
      onChange={(e) => {
        const onlyNumbers = parseCurrency(e.target.value);
        onChange(Number(onlyNumbers) / 100);
      }}
      className={cn("", className)}
    />
  );
}
