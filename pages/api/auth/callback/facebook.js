import { checkUser } from "actions/users"

export default async function handler(req, res) {
  const provider = "facebook"
  const PROVIDER = provider.toUpperCase()

  const CONF_URI = process.env[`${PROVIDER}_CONF_URI`]
  const CLIENT_ID = process.env[`${PROVIDER}_CLIENT_ID`]
  const CLIENT_SECRET = process.env[`${PROVIDER}_CLIENT_SECRET`]
  const REDIRECT_URI = process.env[`${PROVIDER}_REDIRECT_URI`]

  // const conf = await fetch(CONF_URI).then((response) => response.json())
  const oidcCredentials = `${CLIENT_ID}:${CLIENT_SECRET}`
  const formBody = [`grant_type=authorization_code`, `code=${req.query.code}`, `redirect_uri=${REDIRECT_URI}`]
  const data = await fetch("https://graph.facebook.com/oauth/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(oidcCredentials).toString("base64")}`,
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: formBody.join("&"),
  }).then((r) => r.json())

  const curentUser = await fetch("https://graph.facebook.com/me?fields=id,name,email,picture{url}", {
    method: "GET",
    headers: { Authorization: `Bearer ${data.access_token}` },
  }).then((r) => r.json())

  if (curentUser.email) {
    const response = await checkUser(curentUser.email, undefined, curentUser.picture.data.url)
    res.status(200).json(response)
  } else {
    res.status(200).json(curentUser)
  }
}
