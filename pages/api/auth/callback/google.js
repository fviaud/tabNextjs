export default async function handler(req, res) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
  const GOOGLE_REDIRECT_URI = "http://localhost:3000/api/auth/callback/google"
  const url = "https://oauth2.googleapis.com/token"

  const details = {
    grant_type: "authorization_code",
    code: req.query.code,
    redirect_uri: GOOGLE_REDIRECT_URI,
  }

  let property
  let encodedKey
  let encodedValue
  let formBody = []
  for (property in details) {
    encodedKey = encodeURIComponent(property)
    encodedValue = encodeURIComponent(details[property])
    formBody.push(encodedKey + "=" + encodedValue)
  }

  const oidcCredentials = `${GOOGLE_CLIENT_ID}:${GOOGLE_CLIENT_SECRET}`
  const data = await fetch(`${url}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(oidcCredentials).toString("base64")}`,
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: formBody.join("&"),
  }).then((r) => r.json())

  const curentUser = await fetch(`https://openidconnect.googleapis.com/v1/userinfo`, {
    method: "GET",
    headers: { Authorization: `Bearer ${data.access_token}` },
  }).then((r) => r.json())

  res.status(200).json(curentUser)
}
