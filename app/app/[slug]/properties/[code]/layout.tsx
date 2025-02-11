import { getProperty } from "@/lib/actions/properties";
import { validateOrganizationFromSlug } from "@/lib/helpers/organization-validation";
import { redirect } from "next/navigation";
import { PropertyFormLayout } from "./_components/property-form-layout";
import { PropertyProvider } from "../_contexts/property-context";

interface PropertyEditLayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
    code: string;
  };
}

export default async function PropertyEditLayout({
  children,
  params,
}: PropertyEditLayoutProps) {
  const { organization } = await validateOrganizationFromSlug(params.slug);
  try {
    const property = await getProperty(organization.id, params.code);
    return (
      <PropertyProvider
        initialProperty={property}
        initialOrganization={organization}
      >
        <PropertyFormLayout
          organizationSlug={params.slug}
          propertyCode={params.code}
        >
          {children}
        </PropertyFormLayout>
      </PropertyProvider>
    );
  } catch (error) {
    redirect(`/app/${params.slug}/properties`);
  }
}
