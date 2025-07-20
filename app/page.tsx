import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, MessageSquare, GraduationCap, Shield, UserCheck } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Student Advisory System</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive platform for student course registration, academic advising, and communication
          </p>
        </div>

        {/* Get Started Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-white shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900">Get Started</CardTitle>
              <CardDescription>Choose your role to access the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Student Login */}
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Students</h3>
                    <p className="text-sm text-gray-600 mb-4">Register for courses and communicate with advisors</p>
                    <div className="space-y-2">
                      <Link href="/auth/student/login" className="block">
                        <Button className="w-full">Student Login</Button>
                      </Link>
                      <Link href="/auth/student/signup" className="block">
                        <Button variant="outline" className="w-full bg-transparent">
                          New Student? Register
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Admin Login */}
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Administrators</h3>
                    <p className="text-sm text-gray-600 mb-4">Manage system, courses, and users</p>
                    <div className="space-y-2">
                      <Link href="/auth/admin/login" className="block">
                        <Button className="w-full bg-red-600 hover:bg-red-700">Admin Login</Button>
                      </Link>
                      <Link href="/auth/admin/signup" className="block">
                        <Button variant="outline" className="w-full bg-transparent">
                          New Admin? Register
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Advisor Login */}
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Student Advisors</h3>
                    <p className="text-sm text-gray-600 mb-4">Guide and support student academic journey</p>
                    <div className="space-y-2">
                      <Link href="/auth/advisor/login" className="block">
                        <Button className="w-full bg-green-600 hover:bg-green-700">Advisor Login</Button>
                      </Link>
                      <Link href="/auth/advisor/signup" className="block">
                        <Button variant="outline" className="w-full bg-transparent">
                          New Advisor? Register
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">System Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Course Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive course registration system with real-time availability and academic planning tools.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Student Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track student progress, manage enrollments, and provide personalized academic guidance.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageSquare className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Communication Hub</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Seamless messaging system connecting students, advisors, and administrators.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
