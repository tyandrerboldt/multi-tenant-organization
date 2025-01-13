import { OrganizationSettingsForm } from "@/components/settings/organization-settings-form";
import { Card } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface SettingsPageProps {
  params: {
    slug: string;
  };
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const membership = await prisma.membership.findFirst({
    where: {
      organization: {
        slug: params.slug,
      },
      userId: session.user.id,
    },
  });

  if (!membership) {
    redirect("/app");
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
    redirect("/create-organization");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Configurações Gerais</h1>
        <p className="text-gray-600">
          Gerencie as configurações gerais da sua organização.
        </p>
      </div>

      <Card className="p-6">
        <OrganizationSettingsForm organization={organization} />
      </Card>
    </div>
  );
}