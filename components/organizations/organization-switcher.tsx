"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getUserOrganizations } from "@/lib/actions/organization";
import { Role } from "@prisma/client";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Organization = {
  id: string;
  name: string;
  slug: string;
  memberships: {
    role: Role;
  }[];
};

interface OrganizationSwitcherProps {
  currentOrganizationSlug?: string;
}

export function OrganizationSwitcher({
  currentOrganizationSlug,
}: OrganizationSwitcherProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization>();

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const orgs = await getUserOrganizations();
        setOrganizations(orgs);
        const organization = orgs.find(
          (org) => org.slug === currentOrganizationSlug
        );
        organization && setCurrentOrganization(organization);
      } catch (error) {
        console.error("Falha ao carregar organizações:", error);
      }
    };

    loadOrganizations();
  }, [currentOrganizationSlug]);

  const getRoleBadge = (role: Role) => {
    const variants = {
      OWNER: "default",
      ADMIN: "secondary",
      MEMBER: "outline",
    } as const;

    const labels = {
      OWNER: "Proprietário",
      ADMIN: "Admin",
      MEMBER: "Membro",
    };

    return (
      <Badge variant={variants[role]} className="ml-2">
        {labels[role]}
      </Badge>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Selecionar organização"
          className="w-full justify-between"
        >
          <div className="flex items-center">
            <span className="truncate">
              {currentOrganization?.name ?? "Selecionar organização"}
            </span>
            {currentOrganization?.memberships[0]?.role &&
              getRoleBadge(currentOrganization.memberships[0].role)}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar organização..." />
          <CommandList>
            <CommandEmpty>Nenhuma organização encontrada.</CommandEmpty>
            <CommandGroup heading="Suas organizações">
              {organizations.map((org) => (
                <CommandItem
                  key={org.id}
                  onSelect={() => {
                    router.push(`/app/${org.slug}`);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <span>{org.name}</span>
                  <div className="flex items-center">
                    {org.memberships[0]?.role &&
                      getRoleBadge(org.memberships[0].role)}
                    {currentOrganizationSlug === org.slug && (
                      <Check className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  router.push("/create-organization");
                  setOpen(false);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar organização
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
