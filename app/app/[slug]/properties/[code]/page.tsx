import { Card } from "@/components/ui/card";
import { GeneralForm } from "../_components/general-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface EditPropertyPageProps {
  params: {
    slug: string;
    code: string;
  };
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
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
    <Card className="p-6">
      <GeneralForm 
        organizationId={organization.id}
        organizationSlug={params.slug}
      />
    </Card>
  );
}