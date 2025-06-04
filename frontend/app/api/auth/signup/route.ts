import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone } = body

    // Validate required fields
    if (!email || !password || !name || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Save to database
    // For demo purposes, we'll simulate this

    // Simulate checking if user exists
    if (email === "existing@example.com") {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 })
    }

    // Generate user ID and tokens
    const userId = `user-${Date.now()}`
    const token = `jwt-token-${userId}`
    const refreshToken = `refresh-token-${userId}`

    // Set HTTP-only cookie
    cookies().set({
      name: "auth_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Return success response
    return NextResponse.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: userId,
        email,
        name,
        phone,
        role: "customer",
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
