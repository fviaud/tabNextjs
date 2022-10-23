export default async function handler(req, res) {
  const GOOGLE_CONF_URI = process.env.GOOGLE_CONF_URI
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
  const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI

  const confGoogle = await fetch(GOOGLE_CONF_URI).then((response) => response.json())

  const oidcCredentials = `${GOOGLE_CLIENT_ID}:${GOOGLE_CLIENT_SECRET}`
  const formBody = [`grant_type=authorization_code`, `code=${req.query.code}`, `redirect_uri=${GOOGLE_REDIRECT_URI}`]
  const data = await fetch(confGoogle.token_endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(oidcCredentials).toString("base64")}`,
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: formBody.join("&"),
  }).then((r) => r.json())

  const curentUser = await fetch(confGoogle.userinfo_endpoint, {
    method: "GET",
    headers: { Authorization: `Bearer ${data.access_token}` },
  }).then((r) => r.json())

  res.status(200).json(curentUser)
}
