"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updatePreferences } from "@/lib/actions/preferences";
import { usePreferences } from "@/lib/hooks/use-preferences";
import { showToast } from "@/lib/toast";
import {
  PreferencesFormData,
  preferencesSchema,
} from "@/lib/validations/preferences";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface Organization {
  id: string;
  name: string;
}

interface PreferencesFormProps {
  organizations: Organization[];
  defaultValues: Partial<PreferencesFormData>;
}

export function PreferencesForm({
  organizations,
  defaultValues,
}: PreferencesFormProps) {
  const router = useRouter();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues,
  });

  const currentTheme = watch("theme");
  const currentOrganization = watch("defaultOrganizationId");
  const { theme, setTheme } = usePreferences();

  const onSubmit = async (data: PreferencesFormData) => {
    try {
      const result = await updatePreferences(data);
      if (result.success) {
        showToast("Preferências salvas com sucesso", { variant: "success" });
        router.refresh();
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao salvar preferências",
        { variant: "error" }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Organização padrão</Label>
          <Select
            value={currentOrganization}
            onValueChange={(value) => setValue("defaultOrganizationId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma organização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">Nenhuma</SelectItem>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Organização padrão a ser redirecionado ao acessar o sistema
          </p>
        </div>

        <div className="space-y-2">
          <Label>Tema</Label>
          <Select
            value={currentTheme}
            onValueChange={(value: "light" | "dark") => {
              setValue("theme", value);
              setTheme(value)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Claro</SelectItem>
              <SelectItem value="dark">Escuro</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Escolha o tema da sua preferência
          </p>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar preferências"}
      </Button>
    </form>
  );
}
