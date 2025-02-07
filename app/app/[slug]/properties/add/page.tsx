import { Card } from "@/components/ui/card";
import { PropertyProvider } from "../_components/property-context";
import { PropertyFormLayout } from "../_components/property-form-layout";
import { GeneralForm } from "../_components/general-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface AddPropertyPageProps {
  params: {
    slug: string;
  };
}

export default async function AddPropertyPage({ params }: AddPropertyPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const organization = await prisma.organization.findFirst({
    where: {
      slug: params.slug,
      memberships: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!organization) {
    redirect("/app");
  }

  return (
    <PropertyProvider>
      <PropertyFormLayout organizationSlug={params.slug}>
        <Card className="p-6">
          <GeneralForm 
            organizationId={organization.id}
            organizationSlug={params.slug}
          />
        </Card>
      </PropertyFormLayout>
    </PropertyProvider>
  );
}