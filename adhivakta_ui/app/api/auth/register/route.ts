import { NextResponse } from "next/server"
import User from "@/lib/models/user"
import clientPromise from "@/lib/db/mongodb"

export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    await clientPromise

    const body = await request.json()
    const { name, email, password, role } = body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by the pre-save hook
      role: role || "client",
    })

    // Return user without password
    const userWithoutPassword = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 })
  }
}

