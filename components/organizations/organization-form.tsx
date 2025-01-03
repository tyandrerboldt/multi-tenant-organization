"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { OrganizationFormData, organizationSchema } from "@/lib/validations/organization"
import { createOrganization } from "@/lib/actions/organization"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { showToast } from "@/lib/toast"

export function OrganizationForm() {
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
  })

  const name = watch("name", "")

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  }

  const onSubmit = async (data: OrganizationFormData) => {
    try {
      const result = await createOrganization(data)
      if (result.success) {
        showToast("Organization created successfully", { variant: "success" })
        router.push(`/app/${result.organization.slug}`)
        router.refresh()
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to create organization",
        { variant: "error" }
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Organization Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Enter organization name"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug</Label>
        <Input
          id="slug"
          {...register("slug")}
          placeholder="organization-name"
          defaultValue={generateSlug(name)}
        />
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          This will be used in your organization&apos;s URL: 
          <span className="font-mono">domain.com/app/[slug]</span>
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Organization"}
      </Button>
    </form>
  )
}