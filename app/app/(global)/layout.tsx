import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { MobileAppSidebar } from "@/components/layout/sidebar/mobile-app-sidebar";
import { OrganizationSwitcher } from "@/components/organizations/organization-switcher";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen">
      <div className="hidden lg:block w-64 border-r border-border/40 bg-card/50">
        <AppSidebar />
      </div>
      <div className="flex flex-col flex-1">
        <div className="h-14 border-b border-border/40 bg-card/50 flex justify-end items-center px-2">
          <div className="w-[12rem]">
            <OrganizationSwitcher />
          </div>
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto py-6">
            <Breadcrumbs />
            <div className="mb-6 lg:hidden">
              <MobileAppSidebar />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
