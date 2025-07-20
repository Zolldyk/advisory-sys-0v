"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface LoginFormProps {
  userType: "student" | "admin"
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
        body: JSON.stringify({ email, password, userType }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })

        if (data.user.role === "admin" || data.user.role === "advisor") {
          router.push("/admin/dashboard")
        } else {
          router.push("/student/dashboard")
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
          <div className="flex flex-col space-y-2 text-center text-sm">
            <Link href="/" className="text-blue-600 hover:underline">
              Back to Home
            </Link>
            {userType === "admin" && (
              <>
                <Link href="/auth/admin/signup" className="text-blue-600 hover:underline">
                  {"Don't have an admin account? Sign up"}
                </Link>
                <Link href="/auth/advisor/signup" className="text-blue-600 hover:underline">
                  {"Don't have an advisor account? Sign up"}
                </Link>
              </>
            )}
            {userType === "student" && (
              <Link href="/auth/student/signup" className="text-blue-600 hover:underline">
                {"Don't have an account? Sign up"}
              </Link>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
