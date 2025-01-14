"use client";

import { ImageUpload } from "@/components/forms/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  createProperty,
  issetCode,
  updateProperty,
  uploadPropertyImages,
} from "@/lib/actions/properties";
import { showToast } from "@/lib/toast";
import {
  HighlightStatus,
  highlightStatusLabels,
  PropertyType,
  propertyTypeLabels,
  Status,
  statusLabels,
} from "@/lib/types/properties";
import { PropertyFormData, propertySchema } from "@/lib/validations/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import { Property } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface PropertyFormProps {
  organizationId: string;
  property?: Property & {
    images: { url: string; isMain: boolean }[];
    features: { id: number }[];
  };
}

export function PropertyForm({ organizationId, property }: PropertyFormProps) {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [images, setImages] = useState(
    property?.images.map((img) => ({
      url: img.url,
      isMain: img.isMain,
    })) || []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: property
      ? {
          code: property.code,
          name: property.name,
          type: property.type as PropertyType,
          status: property.status as Status,
          highlight: property.highlight as HighlightStatus,
          categoryId: property.categoryId,
          description: property.description,
          featuresIds: property.features.map((f) => f.id),
          images: [],
        }
      : {
          type: PropertyType.HOUSE,
          status: Status.DRAFT,
          highlight: HighlightStatus.NORMAL,
          images: [],
          featuresIds: [],
          categoryId: 1,
        },
  });

  const code = watch("code");

  const handleImagesChange = (
    newImages: { file?: File; url: string; isMain: boolean }[]
  ) => {
    setImages(newImages);
  };

  const onSubmit = async (data: PropertyFormData) => {
    try {
      if (property) {
        // Update existing property
        const result = await updateProperty(organizationId, property.id, data);

        if (result.success) {
          showToast("Imóvel atualizado com sucesso", { variant: "success" });
          router.push(`/app/${params.slug}/properties`);
          router.refresh();
        }
      } else {
        // Create new property
        const result = await createProperty(organizationId, data);

        if (result.success) {
          showToast("Imóvel cadastrado com sucesso", { variant: "success" });
          router.push(`/app/${params.slug}/properties/${result.property.id}/edit`);
          router.refresh();
        }
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao salvar imóvel",
        { variant: "error" }
      );
    }
  };

  const handleUploadImages = async () => {
    if (!property || images.length === 0) return;

    try {
      setIsUploadingImages(true);

      const formData = new FormData();
      formData.append("organizationId", organizationId);
      formData.append("propertyId", property.id);

      // Find main image index
      const mainImageIndex = images.findIndex((img) => img.isMain);
      formData.append("mainImageIndex", mainImageIndex.toString());

      // Append images
      images.forEach((image) => {
        if (image.file) {
          formData.append("images[]", image.file);
        } else {
          formData.append("images[]", image.url);
        }
      });

      await uploadPropertyImages(formData);
      showToast("Imagens atualizadas com sucesso", { variant: "success" });
      router.refresh();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao atualizar imagens",
        { variant: "error" }
      );
    } finally {
      setIsUploadingImages(false);
    }
  };

  // Validate code uniqueness
  useEffect(() => {
    property?.id && validateCode(code, organizationId, property?.id);
  }, [code, organizationId, property?.id]);

  async function validateCode(
    code: string,
    organizationId: string,
    currentPropertyId: string
  ) {
    await issetCode(code, organizationId, currentPropertyId)
      .then((res) => {
        if (res) {
          showToast("Código já está em uso", { variant: "error" });
        }
      })
      .catch((err) => {
        console.error("Error validating code:", err);
        showToast("Erro ao validar código", { variant: "error" });
      });
  }

  return (
    <Tabs defaultValue="general">
      <TabsList>
        <TabsTrigger value="general">Informações Gerais</TabsTrigger>
        {property && <TabsTrigger value="images">Imagens</TabsTrigger>}
      </TabsList>

      <TabsContent value="general">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                {...register("code")}
                placeholder="Código do imóvel"
              />
              {errors.code && (
                <p className="text-sm text-destructive">
                  {errors.code.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Nome do imóvel"
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                onValueChange={(value) =>
                  setValue("type", value as PropertyType, {
                    shouldValidate: true,
                  })
                }
                defaultValue={watch("type")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(propertyTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                onValueChange={(value) =>
                  setValue("status", value as Status, {
                    shouldValidate: true,
                  })
                }
                defaultValue={watch("status")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Destaque</Label>
              <Select
                onValueChange={(value) =>
                  setValue("highlight", value as HighlightStatus, {
                    shouldValidate: true,
                  })
                }
                defaultValue={watch("highlight")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o destaque" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(highlightStatusLabels).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {errors.highlight && (
                <p className="text-sm text-destructive">
                  {errors.highlight.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Descreva o imóvel"
              className="min-h-[150px]"
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => {
                trigger().then((isValid) => {
                  if (!isValid) {
                    showToast("Por favor, corrija os erros no formulário", {
                      variant: "error",
                    });
                  }
                });
              }}
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </TabsContent>

      {property && (
        <TabsContent value="images" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Imagens</Label>
              <ImageUpload
                existingImages={images}
                onImagesChange={handleImagesChange}
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleUploadImages}
                disabled={isUploadingImages || images.length === 0}
              >
                {isUploadingImages ? "Enviando..." : "Atualizar Imagens"}
              </Button>
            </div>
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
}
