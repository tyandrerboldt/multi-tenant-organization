import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Sidebar } from "@/components/layout/sidebar";
import { OrganizationSwitcher } from "@/components/organizations/organization-switcher";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { RolesProvider } from "@/providers/roles-provider";
import { getRoles } from "@/lib/actions/roles";
import { prisma } from "@/lib/prisma";

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
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

  const roles = await getRoles(organization.id);

  return (
    <RolesProvider initialRoles={roles}>
      <div className="flex h-screen">
        <Sidebar organizationSlug={params.slug} />
        <div className="flex flex-col flex-1">
          <div className="h-14 border-b flex justify-end items-center px-2">
            <div className="w-[12rem]">
              <OrganizationSwitcher currentOrganizationSlug={params.slug} />
            </div>
          </div>
          <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-inherit">
            <div className="container mx-auto p-4 py-6">
              <Breadcrumbs />
              <div className="mt-10">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </RolesProvider>
  );
}
