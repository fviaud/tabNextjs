import User from "models/user"
import jsonwebtoken from "jsonwebtoken"
import { serialize } from "cookie"
import dbConnect from "lib/dbConnect"
import { key } from "keys"

export default async function handler(req, res) {
  const { provider } = req.query
  const PROVIDER = provider.toUpperCase()

  const CONF_URI = process.env[`${PROVIDER}_CONF_URI`]
  const CLIENT_ID = process.env[`${PROVIDER}_CLIENT_ID`]
  const CLIENT_SECRET = process.env[`${PROVIDER}_CLIENT_SECRET`]
  const REDIRECT_URI = process.env[`${PROVIDER}_REDIRECT_URI`]

  const conf = await fetch(CONF_URI).then((response) => response.json())

  const oidcCredentials = `${CLIENT_ID}:${CLIENT_SECRET}`
  const formBody = [`grant_type=authorization_code`, `code=${req.query.code}`, `redirect_uri=${REDIRECT_URI}`]
  const data = await fetch(conf.token_endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(oidcCredentials).toString("base64")}`,
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: formBody.join("&"),
  }).then((r) => r.json())

  const curentUser = await fetch(conf.userinfo_endpoint, {
    method: "GET",
    headers: { Authorization: `Bearer ${data.access_token}` },
  }).then((r) => r.json())

  if (curentUser.email) {
    try {
      await dbConnect()
      let user = await User.findOne({ email: curentUser.email }).exec()
      if (!user) {
        const newUser = new User({
          email: curentUser.email,
          picture: curentUser.picture,
        })
        user = await newUser.save()
      }
      const token = jsonwebtoken.sign({}, await key(), {
        subject: user._id.toString(),
        expiresIn: 3600 * 24 * 30 * 6,
        algorithm: "RS256",
      })
      res.setHeader("Set-Cookie", serialize("token", token, { httpOnly: true, path: "/" }))
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(400).json({ error: error })
    }
  } else {
    res.status(400).json("Error acces oAuth")
  }
}
