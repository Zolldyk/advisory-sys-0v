"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/auth"
import { ArrowLeft, BookOpen, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Course {
  id: string
  code: string
  title: string
  credits: number
}

interface CourseRegistrationProps {
  user: User
  allCourses: Course[]
  registeredCourseIds: string[]
}

export function CourseRegistration({ user, allCourses, registeredCourseIds }: CourseRegistrationProps) {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const maxCredits = 24
  const currentCredits = allCourses
    .filter((course) => registeredCourseIds.includes(course.id))
    .reduce((sum, course) => sum + course.credits, 0)

  const selectedCredits = allCourses
    .filter((course) => selectedCourses.includes(course.id))
    .reduce((sum, course) => sum + course.credits, 0)

  const totalCredits = currentCredits + selectedCredits
  const remainingCredits = maxCredits - totalCredits

  const handleCourseToggle = (courseId: string, credits: number) => {
    setSelectedCourses((prev) => {
      const isSelected = prev.includes(courseId)

      if (isSelected) {
        return prev.filter((id) => id !== courseId)
      } else {
        // Check if adding this course would exceed credit limit
        if (totalCredits + credits > maxCredits) {
          toast({
            title: "Credit limit exceeded",
            description: `Adding this course would exceed the ${maxCredits} credit limit.`,
            variant: "destructive",
          })
          return prev
        }
        return [...prev, courseId]
      }
    })
  }

  const handleSubmit = async () => {
    if (selectedCourses.length === 0) {
      toast({
        title: "No courses selected",
        description: "Please select at least one course to register.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/student/register-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseIds: selectedCourses }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Registration successful",
          description: `Successfully registered for ${selectedCourses.length} course(s).`,
        })
        router.push("/student/dashboard")
      } else {
        toast({
          title: "Registration failed",
          description: data.error || "Something went wrong",
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
      setIsSubmitting(false)
    }
  }

  const availableCourses = allCourses.filter((course) => !registeredCourseIds.includes(course.id))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" asChild className="mr-4">
              <Link href="/student/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Registration</h1>
              <p className="text-gray-600">Select courses to register for the semester</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Credit Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentCredits}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Selected Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{selectedCredits}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalCredits > maxCredits ? "text-red-600" : "text-green-600"}`}>
                {totalCredits}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${remainingCredits < 0 ? "text-red-600" : "text-gray-900"}`}>
                {remainingCredits}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credit Limit Warning */}
        {totalCredits > maxCredits && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have exceeded the maximum credit limit of {maxCredits}. Please deselect some courses.
            </AlertDescription>
          </Alert>
        )}

        {/* Available Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Available Courses
            </CardTitle>
            <CardDescription>Select courses you want to register for this semester</CardDescription>
          </CardHeader>
          <CardContent>
            {availableCourses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No available courses to register for</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableCourses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={course.id}
                      checked={selectedCourses.includes(course.id)}
                      onCheckedChange={() => handleCourseToggle(course.id, course.credits)}
                    />
                    <div className="flex-1">
                      <label htmlFor={course.id} className="cursor-pointer">
                        <h3 className="font-semibold">{course.code}</h3>
                        <p className="text-gray-600">{course.title}</p>
                      </label>
                    </div>
                    <Badge variant="secondary">{course.credits} credits</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        {selectedCourses.length > 0 && (
          <div className="mt-8 flex justify-end">
            <Button onClick={handleSubmit} disabled={isSubmitting || totalCredits > maxCredits} size="lg">
              {isSubmitting ? "Registering..." : `Register for ${selectedCourses.length} Course(s)`}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
