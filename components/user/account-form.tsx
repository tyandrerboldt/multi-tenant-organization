"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "next-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AccountFormData, accountSchema } from "@/lib/validations/account"
import { updateAccount } from "@/lib/actions/account"
import { useSession } from "next-auth/react"

interface AccountFormProps {
  user: User
}

export function AccountForm({ user }: AccountFormProps) {
  const router = useRouter()
  const { update: updateSession } = useSession()
  const [error, setError] = useState<string>("")
  const [isSaved, setIsSaved] = useState(false)
  
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
      setError("")
      setIsSaved(false)
      
      const result = await updateAccount(data)
      if (result.success) {
        // Atualiza a sessão com os novos dados
        await updateSession({
          ...user,
          name: data.name,
          email: data.email,
          image: data.image,
        })
        
        setIsSaved(true)
        router.refresh()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <Alert variant="destructive">{error}</Alert>}
      {isSaved && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          Informações atualizadas com sucesso
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={watchedImage || user.image || undefined} />
            <AvatarFallback>
              {user.name?.[0] ?? user.email?.[0] ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="image">URL do Avatar</Label>
            <Input
              id="image"
              {...register("image")}
              placeholder="https://exemplo.com/avatar.jpg"
              className="max-w-md"
            />
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image.message}</p>
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
            <p className="text-sm text-red-500">{errors.name.message}</p>
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
            <p className="text-sm text-red-500">{errors.email.message}</p>
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