import { Card } from "@/components/ui/card";
import { validateOrganizationFromSlug } from "@/lib/helpers/organization-validation";
import { ImagesForm } from "../../_components/images-form";

interface ImagesPageProps {
  params: {
    slug: string;
  };
}

export default async function ImagesPage({ params }: ImagesPageProps) {
  const { organization } = await validateOrganizationFromSlug(params.slug);
  return (
    <Card className="p-6">
      <ImagesForm organizationId={organization.id} />
    </Card>
  );
}
