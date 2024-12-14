"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getUserOrganizations } from "@/lib/actions/organization"

type Organization = {
  id: string
  name: string
  slug: string
}

interface OrganizationSwitcherProps {
  currentOrganization?: Organization
}

export function OrganizationSwitcher({ currentOrganization }: OrganizationSwitcherProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([])

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const orgs = await getUserOrganizations()
        setOrganizations(orgs)
      } catch (error) {
        console.error("Failed to load organizations:", error)
      }
    }

    loadOrganizations()
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select organization"
          className="w-[200px] justify-between"
        >
          {currentOrganization?.name ?? "Select organization"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup heading="Organizations">
              {organizations.map((org) => (
                <CommandItem
                  key={org.id}
                  onSelect={() => {
                    router.push(`/app/${org.slug}`)
                    setOpen(false)
                  }}
                  className="text-sm"
                >
                  {org.name}
                  {currentOrganization?.id === org.id && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  router.push("/create-organization")
                  setOpen(false)
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Organization
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}