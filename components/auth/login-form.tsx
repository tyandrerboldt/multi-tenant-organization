"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { LoginFormData, loginSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { LogInIcon } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string>("")
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email ou senha inválidos")
        return
      }

      router.push("/app")
      router.refresh()
    } catch (error) {
      setError("Algo deu errado. Tente novamente.")
    }
  }

  const loginWithGoogle = async () => {
    try {
      setIsGoogleLoading(true)
      await signIn("google", { callbackUrl: "/app" })
    } catch (error) {
      setError("Erro ao fazer login com Google")
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {error && <Alert variant="destructive">{error}</Alert>}
        {searchParams?.get("error") === "OAuthAccountNotLinked" && (
          <Alert variant="destructive">
            Email já está em uso com outro método de login
          </Alert>
        )}
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={loginWithGoogle}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            "Carregando..."
          ) : (
            <>
              <LogInIcon className="mr-2 h-4 w-4" />
              Entrar com Google
            </>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou continue com
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link
                href="/reset-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-gray-600">
        Não tem uma conta?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  )
}