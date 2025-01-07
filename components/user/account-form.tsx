"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "next-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AccountFormData, accountSchema } from "@/lib/validations/account"
import { updateAccount } from "@/lib/actions/account"
import { useSession } from "next-auth/react"
import { showToast } from "@/lib/toast"

interface AccountFormProps {
  user: User
}

export function AccountForm({ user }: AccountFormProps) {
  const router = useRouter()
  const { update: updateSession } = useSession()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      image: user.image || "",
    },
  })

  const watchedImage = watch("image")

  const onSubmit = async (data: AccountFormData) => {
    try {
      const result = await updateAccount(data)
      if (result.success) {
        // Update session with new data
        await updateSession({
          ...user,
          name: data.name,
          email: data.email,
          image: data.image,
        })
        
        showToast("Account updated successfully", { variant: "success" })
        router.refresh()
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to update account",
        { variant: "error" }
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={watchedImage || user.image || undefined} />
            <AvatarFallback>
              {user.name?.[0] ?? user.email?.[0] ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="image">Avatar URL</Label>
            <Input
              id="image"
              {...register("image")}
              placeholder="https://example.com/avatar.jpg"
              className="max-w-md"
            />
            {errors.image && (
              <p className="text-sm text-destructive">{errors.image.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  )
}