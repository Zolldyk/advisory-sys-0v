import { getSession } from "@/lib/session"
import { AddCourseForm } from "@/components/admin/add-course-form"
import { redirect } from "next/navigation"

export default async function AddCoursePage() {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    redirect("/auth/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AddCourseForm />
      </div>
    </div>
  )
}
