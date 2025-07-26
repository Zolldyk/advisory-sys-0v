import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { User } from "./auth"

// Use a fallback secret if JWT_SECRET is not set
const secretKey = process.env.JWT_SECRET || "fallback-secret-key-for-development-only-change-in-production"
const encodedKey = new TextEncoder().encode(secretKey)

export async function createSession(user: User) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const session = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(encodedKey)

  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })
}

export async function getSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")?.value

    if (!session) return null

    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })

    return payload.user as User
  } catch (error) {
    console.error("Session verification error:", error)
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
