import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Clear the authentication cookie
    cookies().delete("auth_session")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
