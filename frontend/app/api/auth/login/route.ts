import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

// In a real app, you would use a proper authentication system
// This is a simplified example for demonstration purposes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate credentials (in a real app, check against database)
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Simple validation (replace with actual authentication logic)
    if (email === "test@example.com" && password === "password") {
      // Generate tokens (in a real app, use proper JWT signing)
      const token = "example-jwt-token"
      const refreshToken = "example-refresh-token"

      // Set HTTP-only cookie for added security
      cookies().set({
        name: "auth_session",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // Changed from strict to lax for local development
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })

      // Return tokens in response body as well
      return NextResponse.json({
        success: true,
        token,
        refreshToken,
        user: {
          id: "user-1",
          email: "test@example.com",
          name: "Test User",
          role: "customer",
        },
      })
    }

    // For testing farm owner login
    if (email === "farmer@example.com" && password === "password") {
      const token = "example-farmer-jwt-token"
      const refreshToken = "example-farmer-refresh-token"

      cookies().set({
        name: "auth_session",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })

      return NextResponse.json({
        success: true,
        token,
        refreshToken,
        user: {
          id: "user-2",
          email: "farmer@example.com",
          name: "Farmer User",
          role: "farmer",
        },
      })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
