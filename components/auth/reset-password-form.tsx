"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResetPasswordFormData, resetPasswordSchema } from "@/lib/validations/auth"
import { resetPassword } from "@/lib/actions/auth"
import { showToast } from "@/lib/toast"

export function ResetPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsSuccess(false)
      
      const result = await resetPassword(data.email)
      if (result.success) {
        setIsSuccess(true)
        showToast(
          "Password reset link sent",
          {
            variant: "success",
            description: "If an account exists with this email, you will receive a password reset link."
          }
        )
      }
    } catch (error) {
      showToast(
        "Failed to send reset link",
        {
          variant: "error",
          description: error instanceof Error ? error.message : "Please try again later"
        }
      )
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <Button asChild className="w-full">
          <Link href="/login">Return to login</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send reset link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  )
}