import { LoginForm } from "@/components/auth/login-form"

export default function AdvisorLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Student Advisor Login</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Access your advisor dashboard</p>
        </div>
        <LoginForm userType="admin" />
      </div>
    </div>
  )
}
