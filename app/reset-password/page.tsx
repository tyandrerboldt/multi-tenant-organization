import { Card } from "@/components/ui/card"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-4">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Recuperar senha</h1>
            <p className="text-gray-600">
              Digite seu email para receber um link de recuperação
            </p>
          </div>
          
          <ResetPasswordForm />
        </Card>
      </div>
    </div>
  )
}