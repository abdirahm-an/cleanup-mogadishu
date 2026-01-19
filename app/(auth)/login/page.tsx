import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-gray-600">
            Sign in to your Cleanup Mogadishu account
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}