"use client";

import { OrganizationSwitcher } from "@/components/organizations/organization-switcher";
import { UserMenu } from "@/components/user/user-menu";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { MenuContent } from "./menu-content";
import { createAppMenuItems } from "./menu-items/app-menu-items";
import { MenuItem } from "./types";

interface AppSidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function AppSidebar({ onNavigate, className }: AppSidebarProps) {
  const { data: session } = useSession();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const routes = createAppMenuItems();

  const handleMenuSelect = (item: MenuItem) => {
    if (item.submenu) {
      setIsTransitioning(true);
      setActiveMenu(item.label);
      setTimeout(() => setIsTransitioning(false), 450);
    } else if (item.href || item.onClick) {
      item.onClick?.() || onNavigate?.();
    }
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setActiveMenu(null);
    setTimeout(() => setIsTransitioning(false), 450);
  };

  if (!session?.user) return null;

  return (
    <div className={cn("flex h-full flex-col gap-4", className)}>
      <div className="px-3 py-2 flex items-center gap-2 justify-between">
        <OrganizationSwitcher />
        <UserMenu user={session.user} />
      </div>
      <div className="relative flex-1 overflow-hidden">
        <MenuContent
          items={routes}
          activeMenu={activeMenu}
          onMenuSelect={handleMenuSelect}
          onBack={handleBack}
          isMain={true}
          className={cn(isTransitioning && "pointer-events-none")}
        />
        <MenuContent
          items={routes}
          activeMenu={activeMenu}
          onMenuSelect={handleMenuSelect}
          onBack={handleBack}
          className={cn(isTransitioning && "pointer-events-none")}
        />
      </div>
    </div>
  );
}
