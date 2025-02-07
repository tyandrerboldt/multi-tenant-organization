"use client";

import { ImageUpload } from "@/components/forms/image-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createProperty, updatePropertyFeatures, updatePropertyGeneral, uploadPropertyImages } from "@/lib/actions/properties";
import { showToast } from "@/lib/toast";
import { PropertyFormData } from "@/lib/validations/properties";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { AddressTab } from "./address-tab";
import { GeneralTab } from "./general-tab";
import { FeaturesTab } from "./features-tab";
import { AddressData } from "@/lib/types/address";
import { createOrUpdatePropertyAddress } from "@/lib/actions/address";
import { Button } from "../ui/button";

interface PropertyFormProps {
  organizationId: string;
  property?: any;
}

export function PropertyForm({ organizationId, property }: PropertyFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentTab, setCurrentTab] = useState("general");
  const [images, setImages] = useState<
    { file?: File; url: string; isMain: boolean }[]
  >(property?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState<string | null>(null);
  
  // Refs to track form state
  const isDirtyRef = useRef(false);
  const hasImagesChangedRef = useRef(false);

  const handleImagesChange = (
    newImages: { file?: File; url: string; isMain: boolean }[]
  ) => {
    setImages(newImages);
    hasImagesChangedRef.current = true;
  };

  const handleUploadImages = async () => {
    if (!property || images.length === 0) return;

    try {
      setIsUploadingImages(true);

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
      hasImagesChangedRef.current = false;
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
      setIsSubmitting(true);
      await createOrUpdatePropertyAddress(property.id, data);
      showToast("Endereço salvo com sucesso", { variant: "success" });
      isDirtyRef.current = false;
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao salvar endereço",
        { variant: "error" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneralSubmit = async (data: Partial<PropertyFormData>) => {
    try {
      setIsSubmitting(true);

      if (property) {
        const result = await updatePropertyGeneral(organizationId, property.id, data as PropertyFormData);
        if (result.success) {
          showToast("Imóvel atualizado com sucesso", { variant: "success" });
          isDirtyRef.current = false;
          router.refresh();
        }
      } else {
        const result = await createProperty(organizationId, data as PropertyFormData);
        if (result.success) {
          showToast("Imóvel criado com sucesso", { variant: "success" });
          const url = pathname.slice(0, -4) + `/${result.property.code}`
          router.push(url);
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

  const handleFeaturesSubmit = async (features: any) => {
    if (!property) return;

    try {
      setIsSubmitting(true);
      await updatePropertyFeatures(organizationId, property.id, {
        features
      });
      showToast("Características salvas com sucesso", { variant: "success" });
      isDirtyRef.current = false;
      router.refresh();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao salvar características",
        { variant: "error" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (value: string) => {
    if (isSubmitting) return;
    
    // Check if current tab has unsaved changes
    const hasUnsavedChanges = 
      (currentTab === "general" && isDirtyRef.current) ||
      (currentTab === "features" && isDirtyRef.current) ||
      (currentTab === "images" && hasImagesChangedRef.current) ||
      (currentTab === "address" && isDirtyRef.current);

    if (hasUnsavedChanges) {
      setPendingTabChange(value);
      setShowSaveDialog(true);
    } else {
      setCurrentTab(value);
    }
  };

  const confirmTabChange = () => {
    if (pendingTabChange) {
      setCurrentTab(pendingTabChange);
      setPendingTabChange(null);
      isDirtyRef.current = false;
      hasImagesChangedRef.current = false;
    }
    setShowSaveDialog(false);
  };

  const cancelTabChange = () => {
    setPendingTabChange(null);
    setShowSaveDialog(false);
  };

  // Handler for form state changes
  const handleFormStateChange = (isDirty: boolean) => {
    isDirtyRef.current = isDirty;
  };

  return (
    <>
      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Informações Gerais</TabsTrigger>
          {property && (
            <>
              <TabsTrigger value="features">Características</TabsTrigger>
              <TabsTrigger value="images">Imagens</TabsTrigger>
              <TabsTrigger value="address">Endereço</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="general">
          <GeneralTab
            organizationId={organizationId}
            defaultValues={property}
            onSubmit={handleGeneralSubmit}
            isSubmitting={isSubmitting}
            onStateChange={handleFormStateChange}
          />
        </TabsContent>

        {property && (
          <>
            <TabsContent value="features">
              <FeaturesTab
                type={property.type}
                features={property.features}
                onSubmit={handleFeaturesSubmit}
                isSubmitting={isSubmitting}
                onStateChange={handleFormStateChange}
              />
            </TabsContent>

            <TabsContent value="images">
              <ImageUpload
                existingImages={property?.images}
                onImagesChange={handleImagesChange}
              />
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={handleUploadImages} 
                  disabled={isUploadingImages || !hasImagesChangedRef.current}
                >
                  {isUploadingImages ? "Salvando..." : "Salvar imagens"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="address">
              <AddressTab
                defaultValues={property?.PropertyAddress}
                onSubmit={handleAddressSubmit}
                isSubmitting={isSubmitting}
                onStateChange={handleFormStateChange}
              />
            </TabsContent>
          </>
        )}
      </Tabs>

      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Salvar alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Existem alterações não salvas. Deseja salvar antes de mudar de aba?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelTabChange}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTabChange}>
              Continuar sem salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}