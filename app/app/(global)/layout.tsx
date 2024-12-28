import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar"
import { MobileAppSidebar } from "@/components/layout/sidebar/mobile-app-sidebar"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen">
      <div className="hidden lg:block w-64 border-r bg-gray-50/50">
        <AppSidebar />
      </div>
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6">
          <div className="mb-6 lg:hidden">
            <MobileAppSidebar />
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}