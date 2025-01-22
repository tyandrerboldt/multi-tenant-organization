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
import { createOrUpdatePropertyAddress } from "@/lib/actions/address";
import {
  createProperty,
  issetCode,
  updateProperty,
  uploadPropertyImages,
} from "@/lib/actions/properties";
import { showToast } from "@/lib/toast";
import { AddressData } from "@/lib/types/address";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AddressTab } from "./address-tab";

interface PropertyFormProps {
  organizationId: string;
  property?: any;
}

export function PropertyForm({ organizationId, property }: PropertyFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<
    { file?: File; url: string; isMain: boolean }[]
  >(property?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [addressData, setAddressData] = useState<AddressData | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: property
      ? {
          code: property.code,
          name: property.name,
          type: property.type,
          status: property.status,
          highlight: property.highlight,
          categoryId: property.categoryId,
          description: property.description,
          featuresIds: property.features?.map((f: any) => f.id) || [],
        }
      : {
          status: Status.DRAFT,
          highlight: HighlightStatus.NORMAL,
          featuresIds: [],
        },
  });

  useEffect(() => {
    if (property) {
      const address = property.PropertyAddress;
      if (address) {
        setAddressData({
          zipcode: address.address.zipcode,
          street: address.address.street.name,
          city: address.address.city.name,
          state: address.address.state.name,
          stateCode: address.address.state.code,
          neighborhood: address.address.neighborhood.name,
          ...address,
        });
      }
    }
  }, [property]);

  const code = watch("code");

  useEffect(() => {
    if (code && code.length >= 6) {
      const validateCode = async () => {
        const exists = await issetCode(
          code,
          organizationId,
          property?.id || ""
        );
        if (exists) {
          showToast("Esse código já está em uso", { variant: "error" });
        }
      };
      validateCode();
    }
  }, [code, organizationId, property?.id]);

  const handleImagesChange = (
    images: { file?: File; url: string; isMain: boolean }[]
  ) => {
    setImages(images);
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

  const handleAddressSubmit = async (data: AddressData) => {
    if (!property) {
      showToast("Salve o imóvel primeiro", { variant: "error" });
      return;
    }

    try {
      await createOrUpdatePropertyAddress(property.id, data);
      showToast("Endereço salvo com sucesso", { variant: "success" });
      setAddressData(data);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao salvar endereço",
        { variant: "error" }
      );
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    try {
      setIsSubmitting(true);

      if (property) {
        const result = await updateProperty(organizationId, property.id, data);
        if (result.success) {
          showToast("Imóvel atualizado com sucesso", { variant: "success" });
          if (images.length > 0) {
            await handleUploadImages();
          }
        }
      } else {
        const result = await createProperty(organizationId, data);
        if (result.success) {
          showToast("Imóvel criado com sucesso", { variant: "success" });
          router.push(
            `/app/${result.property.slug}/properties/${result.property.id}/edit`
          );
        }
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao salvar imóvel",
        { variant: "error" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Tabs defaultValue="general" className="space-y-6">
      <TabsList>
        <TabsTrigger value="general">Informações Gerais</TabsTrigger>
        <TabsTrigger value="images">Imagens</TabsTrigger>
        <TabsTrigger value="address">Endereço</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-6">
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
                  setValue("type", value as PropertyType)
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
                onValueChange={(value) => setValue("status", value as Status)}
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
                  setValue("highlight", value as HighlightStatus)
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </TabsContent>

      <TabsContent value="images">
        <ImageUpload
          existingImages={property?.images}
          onImagesChange={handleImagesChange}
        />
        {errors.images && (
          <p className="text-sm text-destructive mt-2">
            {errors.images.message}
          </p>
        )}
        <div className="flex justify-end">
          <Button onClick={handleUploadImages} disabled={isUploadingImages}>
            {isUploadingImages ? "Salvando..." : "Salvar imagens"}
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="address">
        <AddressTab
          defaultValues={addressData || undefined}
          onSubmit={handleAddressSubmit}
          isSubmitting={isSubmitting}
        />
      </TabsContent>
    </Tabs>
  );
}
