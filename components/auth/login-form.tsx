"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface LoginFormProps {
  userType: "student" | "admin" | "advisor"
}

export function LoginForm({ userType }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${data.user.name}!`,
        })

        // Redirect based on user role
        if (data.user.role === "student") {
          router.push("/student/dashboard")
        } else if (data.user.role === "admin") {
          router.push("/admin/dashboard")
        } else if (data.user.role === "advisor") {
          router.push("/advisor/dashboard")
        }
      } else {
        toast({
          title: "Login failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getSignupLink = () => {
    switch (userType) {
      case "student":
        return "/auth/student/signup"
      case "admin":
        return "/auth/admin/signup"
      case "advisor":
        return "/auth/advisor/signup"
      default:
        return "/auth/student/signup"
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

  const getSignupText = () => {
    switch (userType) {
      case "student":
        return "New student? Register here"
      case "admin":
        return "New admin? Register here"
      case "advisor":
        return "New advisor? Register here"
      default:
        return "Sign up"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{getTitle()}</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link href={getSignupLink()} className="text-sm text-blue-600 hover:text-blue-500">
              {getSignupText()}
            </Link>
          </div>
          <div className="mt-2 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-500">
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
