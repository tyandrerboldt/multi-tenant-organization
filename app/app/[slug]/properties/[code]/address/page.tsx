import { Card } from "@/components/ui/card";
import { validateOrganizationFromSlug } from "@/lib/helpers/organization-validation";
import { AddressForm } from "../../_components/address-form";

interface AddressPageProps {
  params: {
    slug: string;
  };
}

export default async function AddressPage({ params }: AddressPageProps) {
  await validateOrganizationFromSlug(params.slug);
  return (
    <Card className="p-6">
      <AddressForm />
    </Card>
  );
}
