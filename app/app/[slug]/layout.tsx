import { Sidebar } from "@/components/layout/sidebar"

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  return (
    <div className="flex h-screen">
      <Sidebar organizationSlug={params.slug} />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6">{children}</div>
      </main>
    </div>
  )
}