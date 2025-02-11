"use client";

import { ImageUpload } from "@/components/forms/image-upload";
import { Button } from "@/components/ui/button";
import { uploadPropertyImages } from "@/lib/actions/properties";
import { showToast } from "@/lib/toast";
import { useState } from "react";
import { useProperty } from "../_contexts/property-context";

interface ImagesFormProps {
  organizationId: string;
}

export function ImagesForm({ organizationId }: ImagesFormProps) {
  const { property } = useProperty();
  const [images, setImages] = useState<
    { file?: File; url: string; isMain: boolean }[]
  >(property?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setFormIsDirty] = useState(false);

  const handleImagesChange = (
    newImages: { file?: File; url: string; isMain: boolean }[]
  ) => {
    setImages(newImages);
    setFormIsDirty(true);
  };

  const handleSubmit = async () => {
    if (!property) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("organizationId", organizationId);
      formData.append("propertyId", property.id);

      const mainImageIndex = images.findIndex((img) => img.isMain);
      formData.append("mainImageIndex", mainImageIndex.toString());

      images.forEach((image) => {
        if (image.file) {
          formData.append("images[]", image.file);
        } else {
          formData.append("images[]", image.url);
        }
      });

      await uploadPropertyImages(formData);
      showToast("Imagens atualizadas com sucesso", { variant: "success" });
      setFormIsDirty(false);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao atualizar imagens",
        { variant: "error" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ImageUpload
        existingImages={property?.images}
        onImagesChange={handleImagesChange}
      />

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting || !isDirty}>
          {isSubmitting ? "Salvando..." : "Salvar imagens"}
        </Button>
      </div>
    </div>
  );
}
