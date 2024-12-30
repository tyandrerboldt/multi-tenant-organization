"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PreferencesFormData, preferencesSchema } from "@/lib/validations/preferences"
import { updatePreferences } from "@/lib/actions/preferences"
import { usePreferences } from "@/lib/hooks/use-preferences"

interface Organization {
  id: string
  name: string
}

interface PreferencesFormProps {
  organizations: Organization[]
  defaultValues: Partial<PreferencesFormData>
}

export function PreferencesForm({ organizations, defaultValues }: PreferencesFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const [isSaved, setIsSaved] = useState(false)
  const { theme, setTheme } = usePreferences()
  
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues,
  })

  const currentTheme = watch("theme")
  const currentOrganization = watch("defaultOrganizationId")

  const onSubmit = async (data: PreferencesFormData) => {
    try {
      setError("")
      setIsSaved(false)
      
      const result = await updatePreferences(data)
      if (result.success) {
        setTheme(data.theme)
        setIsSaved(true)
        router.refresh()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Algo deu errado")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <Alert variant="destructive">{error}</Alert>}
      {isSaved && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          Preferências salvas com sucesso
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Organização Padrão</Label>
          <Select
            value={currentOrganization}
            onValueChange={(value) => setValue("defaultOrganizationId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma organização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NULL">Nenhuma</SelectItem>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">
            Organização que será selecionada por padrão ao acessar o sistema
          </p>
        </div>

        <div className="space-y-2">
          <Label>Tema</Label>
          <Select
            value={currentTheme}
            onValueChange={(value: "light" | "dark" | "system") => 
              setValue("theme", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Claro</SelectItem>
              <SelectItem value="dark">Escuro</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">
            Escolha o tema da interface do usuário
          </p>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Salvando..." : "Salvar preferências"}
      </Button>
    </form>
  )
}