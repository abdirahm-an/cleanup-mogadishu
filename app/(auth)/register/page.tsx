import { RegisterForm } from "@/components/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Join Cleanup Mogadishu
          </h1>
          <p className="mt-2 text-gray-600">
            Create your account to help clean up our beautiful city
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}