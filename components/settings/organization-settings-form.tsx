"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateOrganizationSettings } from "@/lib/actions/settings";
import { showToast } from "@/lib/toast";
import {
  OrganizationSettingsFormData,
  organizationSettingsSchema,
} from "@/lib/validations/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface OrganizationSettingsFormProps {
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}

export function OrganizationSettingsForm({
  organization,
}: OrganizationSettingsFormProps) {
  const router = useRouter();

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
  });

  const onSubmit = async (data: OrganizationSettingsFormData) => {
    try {
      const result = await updateOrganizationSettings(organization.id, data);
      if (result.success) {
        showToast("Settings saved successfully", { variant: "success" });
        if (data.slug !== organization.slug) {
          router.push(`/app/${data.slug}/settings`);
        }
        router.refresh();
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to save settings",
        { variant: "error" }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Organization Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug</Label>
        <Input id="slug" {...register("slug")} />
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Used in your organization&apos;s URL:
          <span className="font-mono">domain.com/app/[slug]</span>
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
