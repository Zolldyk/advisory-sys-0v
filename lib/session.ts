import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import type { User } from "@/lib/auth"

const secretKey = process.env.JWT_SECRET || "your-secret-key"
const key = new TextEncoder().encode(secretKey)

/**
 * Encrypt arbitrary JSON into a JWT string valid for 7 days.
 */
async function encrypt(payload: any) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key)
}

/**
 * Decrypt a JWT string produced by `encrypt`.
 */
async function decrypt(token: string) {
  const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] })
  return payload
}

/**
 * Create a session cookie for the supplied user.
 */
export async function createSession(user: User) {
  const jwt = await encrypt({ user })
  const cookieStore = cookies()

  cookieStore.set("session", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

/**
 * Retrieve the current session user (or null if none/expired).
 */
export async function getSession(): Promise<User | null> {
  const jwt = cookies().get("session")?.value
  if (!jwt) return null

  try {
    const { user } = (await decrypt(jwt)) as { user: User }
    return user
  } catch {
    return null
  }
}

/**
 * Clear the browser session cookie.
 */
export function deleteSession() {
  cookies().delete("session")
}
