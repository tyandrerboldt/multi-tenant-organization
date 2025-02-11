import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { OwnerList } from "@/components/properties/owners/owner-list";
import { getOwners } from "@/lib/actions/owners";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

interface OwnersPageProps {
  params: { 
    slug: string 
  }
  searchParams: {
    page?: string
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }
}

export default async function OwnersPage({ 
  params,
  searchParams
}: OwnersPageProps) {
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

  const { owners, totalPages, currentPage, total } = await getOwners({
    organizationId: organization.id,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    search: searchParams.search,
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Proprietários</h1>
          <p className="text-gray-600">
            Gerencie os proprietários dos imóveis ({total} proprietários)
          </p>
        </div>
        <Button asChild>
          <Link href={`/app/${params.slug}/properties/owners/add`}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar
          </Link>
        </Button>
      </div>

      <Card className="p-6">
        <OwnerList
          owners={owners}
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl={`/app/${params.slug}/properties/owners`}
        />
      </Card>
    </div>
  );
}