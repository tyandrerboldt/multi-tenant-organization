import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Sidebar } from "@/components/layout/sidebar";
import { OrganizationSwitcher } from "@/components/organizations/organization-switcher";

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <div className="flex h-screen">
      <Sidebar organizationSlug={params.slug} />
      <div className="flex flex-col flex-1">
        <div className="h-14 border-b border-border/40 bg-card/50 flex justify-end items-center px-2">
          <div className="w-[12rem]">
            <OrganizationSwitcher currentOrganizationSlug={params.slug} />
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
  );
}
