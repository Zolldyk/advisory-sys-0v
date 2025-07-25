"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/auth"
import { Users, BookOpen, MessageSquare, LogOut, Plus, Settings, UserCheck, GraduationCap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Student {
  id: string
  matric_number: string
  name: string
  email: string
  created_at: string
  registrations: Array<{
    courses: {
      code: string
      title: string
      credits: number
    }
  }>
}

interface Course {
  id: string
  code: string
  title: string
  credits: number
}

interface Message {
  id: string
  content: string
  created_at: string
  sender: {
    name: string
    matric_number: string
  }
}

interface AdminDashboardProps {
  user: User
  students: Student[]
  courses: Course[]
  recentMessages: Message[]
}

export function AdminDashboard({ user, students, courses, recentMessages }: AdminDashboardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const totalStudents = students.length
  const totalCourses = courses.length
  const totalMessages = recentMessages.length
  const totalCreditsOffered = courses.reduce((sum, course) => sum + course.credits, 0)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Calculate system statistics
  const activeStudents = students.filter((s) => s.registrations.length > 0).length
  const averageCreditsPerStudent =
    totalStudents > 0
      ? students.reduce(
          (sum, student) => sum + student.registrations.reduce((credits, reg) => credits + reg.courses.credits, 0),
          0,
        ) / totalStudents
      : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
              <p className="text-gray-600">Welcome admin, {user.name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">{activeStudents} actively enrolled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Course Catalog</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground">{totalCreditsOffered} total credits</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMessages}</div>
              <p className="text-xs text-muted-foreground">Recent activity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Credits/Student</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageCreditsPerStudent.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">System average</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Course Management
              </CardTitle>
              <CardDescription>Add new courses to the system catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/courses/add">Add New Course</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="h-5 w-5 mr-2" />
                User Management
              </CardTitle>
              <CardDescription>Manage system users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent" disabled>
                Manage Users (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                System Settings
              </CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent" disabled>
                System Config (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Current system status and metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Student Enrollment Rate</span>
                    <Badge variant="secondary">
                      {totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Course Utilization</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">System Status</span>
                    <Badge className="bg-green-100 text-green-800">Operational</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent System Activity</CardTitle>
                  <CardDescription>Latest system events and registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  {students.length === 0 ? (
                    <p className="text-gray-500 text-sm">No recent activity</p>
                  ) : (
                    <div className="space-y-3">
                      {students.slice(0, 5).map((student) => (
                        <div key={student.id} className="flex items-center justify-between text-sm">
                          <span>{student.name} registered</span>
                          <span className="text-gray-500">{new Date(student.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Registry</CardTitle>
                <CardDescription>Complete list of registered students and their enrollment status</CardDescription>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No students registered yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {students.map((student) => {
                      const totalCredits = student.registrations.reduce((sum, reg) => sum + reg.courses.credits, 0)

                      return (
                        <div key={student.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{student.name}</h3>
                              <p className="text-sm text-gray-600">{student.matric_number}</p>
                              <p className="text-sm text-gray-600">{student.email}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary">{totalCredits} credits</Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                Registered: {new Date(student.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {student.registrations.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium mb-2">Enrolled Courses:</p>
                              <div className="flex flex-wrap gap-2">
                                {student.registrations.map((reg, index) => (
                                  <Badge key={index} variant="outline">
                                    {reg.courses.code} ({reg.courses.credits} cr)
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Course Catalog Management</CardTitle>
                  <CardDescription>Manage the complete course catalog and offerings</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/admin/courses/add">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {courses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No courses in catalog</p>
                    <Button asChild>
                      <Link href="/admin/courses/add">Add First Course</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course) => {
                      // Count how many students are enrolled in this course
                      const enrolledCount = students.filter((student) =>
                        student.registrations.some((reg) => reg.courses.code === course.code),
                      ).length

                      return (
                        <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">{course.code}</h3>
                            <p className="text-gray-600">{course.title}</p>
                            <p className="text-sm text-gray-500">{enrolledCount} students enrolled</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{course.credits} credits</Badge>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>System Activity Log</CardTitle>
                <CardDescription>Recent messages and system interactions</CardDescription>
              </CardHeader>
              <CardContent>
                {recentMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentMessages.map((message) => (
                      <div key={message.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{message.sender.name}</h4>
                            <p className="text-sm text-gray-600">{message.sender.matric_number}</p>
                          </div>
                          <p className="text-xs text-gray-500">{new Date(message.created_at).toLocaleDateString()}</p>
                        </div>
                        <p className="text-gray-700 text-sm">{message.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
