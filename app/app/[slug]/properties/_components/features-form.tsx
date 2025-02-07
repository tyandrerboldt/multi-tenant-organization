"use client";

import { CommercialTab } from "@/components/properties/features/commercial-tab";
import {
  getFeaturesFromPropertyId,
  upsertPropertyFeatures,
} from "@/lib/actions/properties";
import { showToast } from "@/lib/toast";
import { PropertyType } from "@/lib/types/properties";
import { useEffect, useState } from "react";
import { useProperty } from "./property-context";

export function FeaturesForm() {
  const { property } = useProperty();
  const [features, setFeatures] = useState<any>();
  const [isDirty, setIsDirty] = useState(false);

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
      // Other cases will be implemented similarly
      default:
        return null;
    }
  };

  return <div className="space-y-6">{renderFeatureTab()}</div>;
}

// "use client";

// import { CommercialTab } from "@/components/properties/features/commercial-tab";
// import { getFeaturesFromPropertyId } from "@/lib/actions/properties";
// import { PropertyType } from "@/lib/types/properties";
// import { useEffect, useState } from "react";
// import { useProperty } from "./property-context";

// export function FeaturesForm() {
//   const { property } = useProperty();
//   const [features, setFeatures] = useState<any>();

//   async function fetchFeatures(propertyId: string) {
//     const data = await getFeaturesFromPropertyId(propertyId);
//     data && setFeatures(data);
//   }

//   useEffect(() => {
//     property?.id && fetchFeatures(property.id);
//   }, []);

//   const renderFeatureTab = () => {
//     if (!property) return null;

//     switch (property.type) {
//       case PropertyType.APARTMENT:
//         return <ApartmentTab features={features} />;
//       case PropertyType.HOUSE:
//         return <HouseTab features={features} />;
//       case PropertyType.LAND:
//         return <LandTab features={features} />;
//       case PropertyType.COMMERCIAL:
//         return <CommercialTab features={features} />;
//       case PropertyType.SEASON_RENT:
//         return <SeasonRentTab features={features} />;
//       case PropertyType.ROOM_RENT:
//         return <RoomRentTab features={features} />;
//       default:
//         return null;
//     }
//   };

//   return <div className="space-y-6">{renderFeatureTab()}</div>;
// }
