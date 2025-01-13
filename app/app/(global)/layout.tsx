import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Sidebar } from "@/components/layout/sidebar";
import { OrganizationSwitcher } from "@/components/organizations/organization-switcher";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { RolesProvider } from "@/providers/roles-provider";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Para o layout global, podemos inicializar com um array vazio já que
  // essas páginas não dependem de permissões específicas de organização
  return (
    <RolesProvider initialRoles={[]}>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <div className="h-14 border-b border-border/40 bg-card/50 flex justify-end items-center px-2">
            <div className="w-[12rem]">
              <OrganizationSwitcher />
            </div>
          </div>
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-4 py-6">
              <Breadcrumbs />
              {children}
            </div>
          </main>
        </div>
      </div>
    </RolesProvider>
  );
}