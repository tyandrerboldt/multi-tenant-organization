"use client";

import {
  getFeaturesFromPropertyId,
  upsertPropertyFeatures,
} from "@/lib/actions/properties";
import { showToast } from "@/lib/toast";
import { PropertyType } from "@/lib/types/properties";
import { useEffect, useState } from "react";
import { ApartmentTab } from "./tabs/apartment-tab";
import { CommercialTab } from "./tabs/commercial-tab";
import { HouseTab } from "./tabs/house-tab";
import { LandTab } from "./tabs/land-tab";
import { RoomRentTab } from "./tabs/room-rent-tab";
import { SeasonRentTab } from "./tabs/season-rent-tab";
import { useProperty } from "../../../_contexts/property-context";

export function FeaturesForm() {
  const { property } = useProperty();
  const [features, setFeatures] = useState<any>();

  async function fetchFeatures(propertyId: string) {
    const data = await getFeaturesFromPropertyId(propertyId);
    data && setFeatures(data);
  }

  useEffect(() => {
    property?.id && fetchFeatures(property.id);
  }, [property?.id]);

  const handleSubmit = async (data: any) => {
    if (!property?.id) return;

    try {
      const result = await upsertPropertyFeatures(property.id, data);
      if (result.success) {
        showToast("Características salvas com sucesso", { variant: "success" });
        setFeatures(result.property);
      }
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Falha ao salvar características",
        { variant: "error" }
      );
    }
  };

  const renderFeatureTab = () => {
    if (!property) return null;

    switch (property.type) {
      case PropertyType.COMMERCIAL:
        return <CommercialTab features={features} onSubmit={handleSubmit} />;
      case PropertyType.HOUSE:
        return <HouseTab features={features} onSubmit={handleSubmit} />;
      case PropertyType.APARTMENT:
        return <ApartmentTab features={features} onSubmit={handleSubmit} />;
      case PropertyType.LAND:
        return <LandTab features={features} onSubmit={handleSubmit} />;
      case PropertyType.SEASON_RENT:
        return <SeasonRentTab features={features} onSubmit={handleSubmit} />;
      case PropertyType.ROOM_RENT:
        return <RoomRentTab features={features} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  return <div className="space-y-6">{renderFeatureTab()}</div>;
}
