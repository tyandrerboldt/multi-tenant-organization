import { Sidebar } from "@/components/layout/sidebar";

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <div className="flex h-screen">
      <div className="hidden w-64 border-r bg-gray-50/50 lg:block">
        <Sidebar organizationSlug={params.slug} />
      </div>
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6">{children}</div>
      </main>
    </div>
  );
}
