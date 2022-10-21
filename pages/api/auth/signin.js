// api/users.js
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"
import { serialize } from "cookie"
import dbConnect from "lib/dbConnect"
import User from "models/User"
import { key } from "keys"

export default async function handler(req, res) {
  const { method } = req
  const { email, password } = req.body

  await dbConnect()

  switch (method) {
    case "POST":
      try {
        const user = await User.findOne({ email }).exec()
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
            const token = jsonwebtoken.sign({}, await key(), {
              subject: user._id.toString(),
              expiresIn: 3600 * 24 * 30 * 6,
              algorithm: "RS256",
            })
            // res.cookie("token", token, { httpOnly: true })
            res.setHeader("Set-Cookie", serialize("token", token, { httpOnly: true }))
            res.json(user)
          } else {
            res.status(400).json("Mauvais email/password")
          }
        } else {
          res.status(400).json("Mauvais email/password")
        }
      } catch (e) {
        console.log(e)
        res.status(400).json("Mauvais email/password")
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
