"use client"

import { Card } from "@/components/ui/card";
import { GeneralForm } from "../_components/general-form";
import { useProperty } from "../_contexts/property-context";

interface EditPropertyPageProps {
  params: {
    slug: string;
    code: string;
  };
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { property, setProperty, organization } = useProperty()

  return (
    <Card className="p-6">
      <GeneralForm 
        initialData={property}
        onPropertyChange={setProperty}
        organizationId={organization.id}
        organizationSlug={params.slug}
      />
    </Card>
  );
}