// import { cookies } from "next/headers"
// import { type NextRequest, NextResponse } from "next/server"

// export async function GET(request: NextRequest) {
//   try {
//     // Get the authorization header
//     const authHeader = request.headers.get("authorization")

//     // Get the session cookie
//     const sessionCookie = cookies().get("auth_session")

//     // Check if we have either an auth header or a session cookie
//     if ((!authHeader || !authHeader.startsWith("Bearer ")) && !sessionCookie) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Extract the token from header or use cookie
//     let token = ""
//     if (authHeader && authHeader.startsWith("Bearer ")) {
//       token = authHeader.split(" ")[1]
//     } else if (sessionCookie) {
//       token = sessionCookie.value
//     }

//     // In a real app, validate the token and fetch user data from database
//     // For this example, we'll return mock user data based on the token
//     if (token === "example-jwt-token") {
//       return NextResponse.json({
//         id: "user-1",
//         email: "test@example.com",
//         name: "Test User",
//         role: "customer",
//       })
//     } else if (token === "example-farmer-jwt-token") {
//       return NextResponse.json({
//         id: "user-2",
//         email: "farmer@example.com",
//         name: "Farmer User",
//         role: "farmer",
//       })
//     }

//     return NextResponse.json({ error: "Invalid token" }, { status: 401 })
//   } catch (error) {
//     console.error("User fetch error:", error)
//     return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
//   }
// }
