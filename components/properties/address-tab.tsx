"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AddressFormData, addressFormSchema } from "@/lib/validations/address";
import { AddressData, AddressLookupResult } from "@/lib/types/address";
import { lookupAddress } from "@/lib/services/address";
import { showToast } from "@/lib/toast";

interface AddressTabProps {
  defaultValues?: AddressData;
  onSubmit: (data: AddressData) => Promise<void>;
  isSubmitting?: boolean;
  onStateChange?: (isDirty: boolean) => void;
}

export function AddressTab({ 
  defaultValues, 
  onSubmit, 
  isSubmitting,
  onStateChange 
}: AddressTabProps) {
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [addressLookup, setAddressLookup] = useState<AddressLookupResult | null>(
    defaultValues
      ? {
          zipcode: defaultValues.zipcode,
          street: defaultValues.street,
          neighborhood: defaultValues.neighborhood,
          city: defaultValues.city,
          state: defaultValues.state,
          stateCode: defaultValues.stateCode,
        }
      : null
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
    reset
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: defaultValues
      ? {
          zipcode: defaultValues.zipcode,
          number: defaultValues.number,
          complement: defaultValues.complement,
        }
      : undefined,
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        zipcode: defaultValues.zipcode,
        number: defaultValues.number,
        complement: defaultValues.complement,
      });
      setAddressLookup({
        zipcode: defaultValues.zipcode,
        street: defaultValues.street,
        neighborhood: defaultValues.neighborhood,
        city: defaultValues.city,
        state: defaultValues.state,
        stateCode: defaultValues.stateCode,
      });
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    onStateChange?.(isDirty);
  }, [isDirty, onStateChange]);

  const zipcode = watch("zipcode");

  useEffect(() => {
    if (zipcode) {
      const formatted = zipcode.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");
      if (formatted !== zipcode) {
        setValue("zipcode", formatted);
      }
    }
  }, [zipcode, setValue]);

  const handleLookupAddress = async () => {
    try {
      setIsLookingUp(true);
      const result = await lookupAddress(zipcode);
      setAddressLookup(result);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao buscar endereço",
        { variant: "error" }
      );
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleFormSubmit = async (data: AddressFormData) => {
    if (!addressLookup) {
      showToast("Por favor, busque o CEP primeiro", { variant: "error" });
      return;
    }

    await onSubmit({
      ...addressLookup,
      number: data.number,
      complement: data.complement,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="zipcode">CEP</Label>
          <div className="flex gap-2">
            <Input
              id="zipcode"
              {...register("zipcode")}
              placeholder="00000-000"
              maxLength={9}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleLookupAddress}
              disabled={isLookingUp || !zipcode || zipcode.length < 8}
            >
              {isLookingUp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Buscar
            </Button>
          </div>
          {errors.zipcode && (
            <p className="text-sm text-destructive">{errors.zipcode.message}</p>
          )}
        </div>
      </div>

      {addressLookup && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Logradouro</Label>
              <Input value={addressLookup.street} disabled />
            </div>

            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input value={addressLookup.neighborhood} disabled />
            </div>

            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input value={addressLookup.city} disabled />
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Input value={addressLookup.state} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                {...register("number")}
                placeholder="Digite o número"
              />
              {errors.number && (
                <p className="text-sm text-destructive">{errors.number.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                {...register("complement")}
                placeholder="Apto, sala, etc."
              />
              {errors.complement && (
                <p className="text-sm text-destructive">
                  {errors.complement.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? "Salvando..." : "Salvar endereço"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}