import { getSession } from "@/lib/session"
import { AdminDashboard } from "@/components/admin/dashboard"
import { redirect } from "next/navigation"

export default async function AdminDashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/admin/login")
    return
  }

  if (session.role !== "admin") {
    redirect("/auth/admin/login")
    return
  }

  return <AdminDashboard user={session} />
}
