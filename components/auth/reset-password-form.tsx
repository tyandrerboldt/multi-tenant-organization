"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { ResetPasswordFormData, resetPasswordSchema } from "@/lib/validations/auth"
import { resetPassword } from "@/lib/actions/auth"

export function ResetPasswordForm() {
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setError("")
      setSuccess(false)
      
      const result = await resetPassword(data.email)
      if (result.success) {
        setSuccess(true)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Algo deu errado")
    }
  }

  if (success) {
    return (
      <div className="space-y-4">
        <Alert className="bg-green-50 text-green-800 border-green-200">
          Se existe uma conta com este email, você receberá um link para redefinir sua senha.
        </Alert>
        <Button asChild className="w-full">
          <Link href="/login">Voltar para login</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <Alert variant="destructive">{error}</Alert>}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="seu@email.com"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Lembrou sua senha?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Voltar para login
        </Link>
      </p>
    </form>
  )
}