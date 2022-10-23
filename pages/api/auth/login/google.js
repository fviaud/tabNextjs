import { NextRequest, NextResponse, userAgent } from "next/server"

export default async function handler(req, res) {
  const data = await fetch("https://accounts.google.com/.well-known/openid-configuration").then((response) => response.json())

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  // const GOOGLE_CLIENT_SECRET = process.env.("GOOGLE_CLIENT_SECRET")
  const GOOGLE_REDIRECT_URI = "http://localhost:3000/api/auth/callback/google"
  const url = `${data.authorization_endpoint}/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&scope=email`

  res.redirect(307, url).end()
}
