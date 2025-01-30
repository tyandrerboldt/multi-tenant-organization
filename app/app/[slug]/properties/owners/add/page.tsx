import { Card } from "@/components/ui/card";
import { OwnerForm } from "@/components/properties/owners/owner-form";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

interface AddOwnerPageProps {
  params: { 
    slug: string 
  }
}

export default async function AddOwnerPage({ params }: AddOwnerPageProps) {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Adicionar Proprietário</h1>
        <p className="text-gray-600">
          Cadastre um novo proprietário no sistema
        </p>
      </div>

      <Card className="p-6">
        <OwnerForm organizationId={organization.id} />
      </Card>
    </div>
  );
}