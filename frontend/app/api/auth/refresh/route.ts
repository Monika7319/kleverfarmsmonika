import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token is required" }, { status: 400 })
    }

    // In a real app, validate the refresh token against your database
    // and check if it's expired or revoked

    // For this example, we'll just issue a new token
    const newToken = "new-example-jwt-token"

    // Set HTTP-only cookie
    cookies().set({
      name: "auth_session",
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return NextResponse.json({
      success: true,
      token: newToken,
    })
  } catch (error) {
    console.error("Token refresh error:", error)
    return NextResponse.json({ error: "Token refresh failed" }, { status: 500 })
  }
}
