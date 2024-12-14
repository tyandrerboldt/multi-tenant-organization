import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen">
      <div className="hidden w-64 border-r bg-gray-50/50 lg:block">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6">
          {children}
        </div>
      </main>
    </div>
  )
}