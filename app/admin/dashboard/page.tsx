import { getSession } from "@/lib/session"
import { AdminDashboard } from "@/components/admin/dashboard"
import { redirect } from "next/navigation"

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

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
