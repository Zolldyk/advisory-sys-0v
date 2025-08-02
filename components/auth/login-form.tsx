"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Loader2 } from "lucide-react"

interface LoginFormProps {
  userType: "student" | "admin" | "advisor"
}

export function LoginForm({ userType }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.user) {
        console.log("Login successful, user data:", data.user)
        toast({
          title: "Login successful",
          description: `Welcome back, ${data.user.name}!`,
        })

        // Redirect based on user role
        console.log("Redirecting user with role:", data.user.role)
        switch (data.user.role) {
          case "student":
            console.log("Redirecting to student dashboard")
            router.push("/student/dashboard")
            break
          case "admin":
            console.log("Redirecting to admin dashboard")
            router.push("/admin/dashboard")
            break
          case "advisor":
            console.log("Redirecting to advisor dashboard")
            router.push("/advisor/dashboard")
            break
          default:
            console.log("Redirecting to home page")
            router.push("/")
        }
      } else {
        setError(data.error || "Login failed. Please check your credentials.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getTitle = () => {
    switch (userType) {
      case "student":
        return "Student Login"
      case "admin":
        return "Admin Login"
      case "advisor":
        return "Advisor Login"
      default:
        return "Login"
    }
  }

  const getDescription = () => {
    switch (userType) {
      case "student":
        return "Access your student dashboard and course registration"
      case "admin":
        return "Access the administrative dashboard"
      case "advisor":
        return "Access your advisor dashboard and student messaging"
      default:
        return "Sign in to your account"
    }
  }

  const getSignupLink = () => {
    switch (userType) {
      case "student":
        return { href: "/auth/student/signup", text: "New student? Register here" }
      case "admin":
        return { href: "/auth/admin/signup", text: "New admin? Register here" }
      case "advisor":
        return { href: "/auth/advisor/signup", text: "New advisor? Register here" }
      default:
        return null
    }
  }

  const signupLink = getSignupLink()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{getTitle()}</CardTitle>
          <CardDescription className="text-center">{getDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            {signupLink && (
              <p className="text-sm text-gray-600">
                <Link href={signupLink.href} className="text-blue-600 hover:text-blue-500">
                  {signupLink.text}
                </Link>
              </p>
            )}
            <p className="text-sm text-gray-600">
              <Link href="/" className="text-blue-600 hover:text-blue-500">
                Back to home
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
