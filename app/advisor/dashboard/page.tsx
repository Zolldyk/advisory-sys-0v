import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { AdvisorDashboard } from "@/components/advisor/dashboard"

export default async function AdvisorDashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/advisor/login")
  }

  if (session.role !== "advisor") {
    redirect("/")
  }

  return <AdvisorDashboard user={session} />
}
