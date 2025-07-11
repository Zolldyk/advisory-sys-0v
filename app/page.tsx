import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, Users, GraduationCap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Student Advisory System</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline academic advising with our mobile-friendly platform for students and advisors
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Course Registration</CardTitle>
              <CardDescription>Easy course selection and registration with credit limit management</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Direct Communication</CardTitle>
              <CardDescription>Secure messaging between students and academic advisors</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Student Management</CardTitle>
              <CardDescription>Comprehensive dashboard for advisors to manage student records</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Login Options */}
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Get Started</CardTitle>
              <CardDescription className="text-center">Choose your role to access the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild className="w-full sm:w-auto min-w-[140px]" size="lg">
                  <Link href="/auth/student/login">Student Login</Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto min-w-[140px] bg-transparent" size="lg">
                  <Link href="/auth/admin/login">Admin Login</Link>
                </Button>
              </div>
              <div className="text-center pt-2">
                <Link href="/auth/student/signup" className="text-sm text-blue-600 hover:underline">
                  New student? Sign up here
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
