"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { DeleteOrganizationFormData, deleteOrganizationSchema } from "@/lib/validations/settings"
import { deleteOrganization } from "@/lib/actions/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert } from "@/components/ui/alert"

interface DeleteOrganizationProps {
  organization: {
    id: string
    name: string
  }
}

export function DeleteOrganization({ organization }: DeleteOrganizationProps) {
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DeleteOrganizationFormData>({
    resolver: zodResolver(deleteOrganizationSchema),
  })

  const onSubmit = async (data: DeleteOrganizationFormData) => {
    if (data.organizationName !== organization.name) {
      setError("Organization name doesn't match")
      return
    }

    try {
      setError("")
      const result = await deleteOrganization(organization.id)
      if (result.success) {
        setIsOpen(false)
        router.push("/app")
        router.refresh()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) {
        reset()
        setError("")
      }
    }}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Organization</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Organization</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            organization and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <Alert variant="destructive">{error}</Alert>}
          
          <div className="space-y-2">
            <Label htmlFor="organizationName">
              Type <span className="font-semibold">{organization.name}</span> to confirm
            </Label>
            <Input
              id="organizationName"
              {...register("organizationName")}
              placeholder="Organization name"
            />
            {errors.organizationName && (
              <p className="text-sm text-red-500">{errors.organizationName.message}</p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete Organization"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}