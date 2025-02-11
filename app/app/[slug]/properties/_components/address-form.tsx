"use client";

import { AddressTab } from "@/components/properties/address-tab";
import { createOrUpdatePropertyAddress } from "@/lib/actions/address";
import { showToast } from "@/lib/toast";
import { AddressData } from "@/lib/types/address";
import { useState } from "react";
import { useProperty } from "../_contexts/property-context";

export function AddressForm() {
  const { property } = useProperty();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setFormIsDirty] = useState(false);

  const handleSubmit = async (data: AddressData) => {
    if (!property) {
      showToast("Salve o imóvel primeiro", { variant: "error" });
      return;
    }

    try {
      setIsSubmitting(true);
      await createOrUpdatePropertyAddress(property.id, data);
      showToast("Endereço salvo com sucesso", { variant: "success" });
      setFormIsDirty(false);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao salvar endereço",
        { variant: "error" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AddressTab
      defaultValues={property?.PropertyAddress}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onStateChange={setFormIsDirty}
    />
  );
}
