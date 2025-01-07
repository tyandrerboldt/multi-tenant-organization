import { RegisterForm } from "@/components/auth/register-form"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-4">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Cadastrar Conta</h1>
            <p className="text-gray-600">Inicie o cadastro e sua organização</p>
          </div>
          
          <RegisterForm />
          
          <p className="mt-4 text-center text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Acessar
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}