import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-4">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Bem vindo!</h1>
            <p className="text-gray-600">Faça login com sua conta</p>
          </div>

          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
