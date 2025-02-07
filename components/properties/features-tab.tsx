"use client";

import { useEffect, useState } from "react";
import { PropertyType } from "@/lib/types/properties";
import { ApartmentTab } from "./features/apartment-tab";
import { HouseTab } from "./features/house-tab";
import { LandTab } from "./features/land-tab";
import { CommercialTab } from "./features/commercial-tab";
import { SeasonRentTab } from "./features/season-rent-tab";
import { RoomRentTab } from "./features/room-rent-tab";
import { Button } from "@/components/ui/button";

interface FeaturesTabProps {
  type: PropertyType;
  features: any;
  onSubmit: (features: any) => Promise<void>;
  isSubmitting?: boolean;
  onStateChange?: (isDirty: boolean) => void;
}

export function FeaturesTab({
  type,
  features: initialFeatures,
  onSubmit,
  isSubmitting,
  onStateChange
}: FeaturesTabProps) {
  const [features, setFeatures] = useState(initialFeatures || {});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFeatures(initialFeatures || {});
    setIsDirty(false);
  }, [initialFeatures]);

  useEffect(() => {
    onStateChange?.(isDirty);
  }, [isDirty, onStateChange]);

  const handleFeaturesChange = (newFeatures: any) => {
    setFeatures(newFeatures);
    setIsDirty(true);
  };

  const handleSubmit = async () => {
    await onSubmit(features);
    setIsDirty(false);
  };

  const renderFeatureTab = () => {
    switch (type) {
      case "APARTMENT":
        return (
          <ApartmentTab
            features={features}
            onChange={handleFeaturesChange}
          />
        );
      case "HOUSE":
        return (
          <HouseTab
            features={features}
            onChange={handleFeaturesChange}
          />
        );
      case "LAND":
        return (
          <LandTab
            features={features}
            onChange={handleFeaturesChange}
          />
        );
      case "COMMERCIAL":
        return (
          <CommercialTab
            features={features}
            onChange={handleFeaturesChange}
          />
        );
      case "SEASON_RENT":
        return (
          <SeasonRentTab
            features={features}
            onChange={handleFeaturesChange}
          />
        );
      case "ROOM_RENT":
        return (
          <RoomRentTab
            features={features}
            onChange={handleFeaturesChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderFeatureTab()}
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || !isDirty}
        >
          {isSubmitting ? "Salvando..." : "Salvar características"}
        </Button>
      </div>
    </div>
  );
}