"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { OrganizationSettingsFormData, organizationSettingsSchema } from "@/lib/validations/settings"
import { updateOrganizationSettings } from "@/lib/actions/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"

interface OrganizationSettingsFormProps {
  organization: {
    id: string
    name: string
    slug: string
  }
}

export function OrganizationSettingsForm({ organization }: OrganizationSettingsFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const [isSaved, setIsSaved] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<OrganizationSettingsFormData>({
    resolver: zodResolver(organizationSettingsSchema),
    defaultValues: {
      name: organization.name,
      slug: organization.slug,
    },
  })

  const onSubmit = async (data: OrganizationSettingsFormData) => {
    try {
      setError("")
      setIsSaved(false)
      
      const result = await updateOrganizationSettings(organization.id, data)
      if (result.success) {
        setIsSaved(true)
        if (data.slug !== organization.slug) {
          router.push(`/dashboard/${data.slug}/settings`)
        }
        router.refresh()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <Alert variant="destructive">{error}</Alert>}
      {isSaved && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          Settings saved successfully
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">Organization Name</Label>
        <Input
          id="name"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug</Label>
        <Input
          id="slug"
          {...register("slug")}
        />
        {errors.slug && (
          <p className="text-sm text-red-500">{errors.slug.message}</p>
        )}
        <p className="text-sm text-gray-500">
          Used in your organization&apos;s URL: 
          <span className="font-mono">domain.com/dashboard/[slug]</span>
        </p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !isDirty}
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}