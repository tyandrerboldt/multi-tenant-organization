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

  const membership = await prisma.membership.findFirst({
    where: {
      organizationId: organization.id,
      userId: session.user.id,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Organization Settings</h1>
        <p className="text-gray-600">
          Manage your organization&apos;s settings and preferences.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">General Settings</h2>
        <OrganizationSettingsForm organization={organization} />
      </Card>
    </div>
  );
}
