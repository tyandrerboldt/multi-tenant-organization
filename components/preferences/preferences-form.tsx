"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PreferencesFormData,
  preferencesSchema,
} from "@/lib/validations/preferences";
import { updatePreferences } from "@/lib/actions/preferences";
import { showToast } from "@/lib/toast";
import { useTheme } from "next-themes";

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
  const { theme, setTheme } = useTheme();

  const onSubmit = async (data: PreferencesFormData) => {
    try {
      const result = await updatePreferences(data);
      if (result.success) {
        showToast("Preferences saved successfully", { variant: "success" });
        setTheme(data.theme);
        router.refresh();
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to save preferences",
        { variant: "error" }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Default Organization</Label>
          <Select
            value={currentOrganization}
            onValueChange={(value) => setValue("defaultOrganizationId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an organization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">None</SelectItem>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Organization that will be selected by default when accessing the
            system
          </p>
        </div>

        <div className="space-y-2">
          <Label>Theme</Label>
          <Select
            value={currentTheme}
            onValueChange={(value: "light" | "dark" | "system") =>
              setValue("theme", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Choose the user interface theme
          </p>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save preferences"}
      </Button>
    </form>
  );
}
