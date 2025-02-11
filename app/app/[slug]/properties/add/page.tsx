import { Card } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PropertyFormLayout } from "../[code]/_components/property-form-layout";
import { GeneralForm } from "../_components/general-form";

interface AddPropertyPageProps {
  params: {
    slug: string;
  };
}

export default async function AddPropertyPage({
  params,
}: AddPropertyPageProps) {
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
    <PropertyFormLayout organizationSlug={params.slug}>
      <Card className="p-6">
        <GeneralForm
          organizationId={organization.id}
          organizationSlug={params.slug}
        />
      </Card>
    </PropertyFormLayout>
  );
}
