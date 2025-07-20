import { supabase } from "./supabase"
import bcrypt from "bcryptjs"

export interface User {
  id: string
  matric_number?: string
  email: string
  name: string
  role: "student" | "admin" | "advisor"
}

export async function signUp(data: {
  matricNumber?: string
  email: string
  password: string
  name: string
  role?: "student" | "admin" | "advisor"
}) {
  // Check if email already exists
  const { data: existingUser } = await supabase.from("users").select("email").eq("email", data.email).single()

  if (existingUser) {
    throw new Error("An account with this email already exists")
  }

  const hashedPassword = await bcrypt.hash(data.password, 10)

  const userData = {
    email: data.email,
    password_hash: hashedPassword,
    role: data.role || "student",
    name: data.name,
    ...(data.matricNumber && { matric_number: data.matricNumber }),
  }

  const { data: user, error } = await supabase.from("users").insert(userData).select().single()

  if (error) {
    if (error.code === "23505") {
      // Unique constraint violation
      throw new Error("An account with this email already exists")
    }
    throw error
  }
  return user
}

export async function signIn(email: string, password: string) {
  const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single()

  if (error || !user) throw new Error("Invalid credentials")

  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) throw new Error("Invalid credentials")

  return {
    id: user.id,
    matric_number: user.matric_number,
    email: user.email,
    name: user.name,
    role: user.role,
  } as User
}
