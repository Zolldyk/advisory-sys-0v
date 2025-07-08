import { supabase } from "./supabase"
import bcrypt from "bcryptjs"

export interface User {
  id: string
  matric_number?: string
  email: string
  name: string
  role: "student" | "admin"
}

export async function signUp(data: {
  matricNumber: string
  email: string
  password: string
  name: string
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10)

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      matric_number: data.matricNumber,
      email: data.email,
      password_hash: hashedPassword,
      role: "student",
      name: data.name,
    })
    .select()
    .single()

  if (error) throw error
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
