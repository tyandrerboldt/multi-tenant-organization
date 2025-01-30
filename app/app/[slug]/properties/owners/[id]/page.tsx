import { Card } from "@/components/ui/card";
import { OwnerForm } from "@/components/properties/owners/owner-form";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

interface EditOwnerPageProps {
  params: { 
    slug: string;
    id: string;
  }
}

export default async function EditOwnerPage({ params }: EditOwnerPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const organization = await prisma.organization.findFirst({
    where: {
      slug: params.slug,
      memberships: {
        some: {
          userId: session.user.id
        }
      }
    }
  });

  if (!organization) {
    redirect("/app");
  }

  const owner = await prisma.owner.findFirst({
    where: {
      id: params.id,
      organizationId: organization.id
    }
  });

  if (!owner) {
    redirect(`/app/${params.slug}/properties/owners`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Editar Proprietário</h1>
        <p className="text-gray-600">
          Atualize as informações do proprietário
        </p>
      </div>

      <Card className="p-6">
        <OwnerForm 
          organizationId={organization.id}
          owner={owner}
        />
      </Card>
    </div>
  );
}