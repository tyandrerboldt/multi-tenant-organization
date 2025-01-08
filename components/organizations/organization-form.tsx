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
        showToast("Organização criada com sucesso", { variant: "success" })
        router.push(`/app/${result.organization.slug}`)
        router.refresh()
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao criar organização",
        { variant: "error" }
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Organização</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Insira o nome da organização"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug da URL</Label>
        <Input
          id="slug"
          {...register("slug")}
          placeholder="nome-da-organizacao"
          defaultValue={generateSlug(name)}
        />
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          <span>Isso será usado na URL da sua organização:</span> <span className="font-mono">domain.com/app/[slug]</span>
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Criando..." : "Criar Organização"}
      </Button>
    </form>
  )
}