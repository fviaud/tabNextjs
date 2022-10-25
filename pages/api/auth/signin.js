// api/users.js
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"
import { serialize } from "cookie"
import dbConnect from "lib/dbConnect"
import User from "models/user"
import { key } from "keys"

export default async function handler(req, res) {
  const { method } = req
  switch (method) {
    case "POST":
      try {
        const { email, password } = req.body
        await dbConnect()
        const user = await User.findOne({ email }).exec()
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
            const token = jsonwebtoken.sign({}, await key(), {
              subject: user._id.toString(),
              expiresIn: 3600 * 24 * 30 * 6,
              algorithm: "RS256",
            })
            res.setHeader("Set-Cookie", serialize("token", token, { httpOnly: true }))
            res.status(200).json({ success: true })
          } else {
            res.status(400).json({ success: false, message: "Incorrect password" })
          }
        } else {
          res.status(400).json({ success: false, message: "User unknown" })
        }
      } catch (error) {
        res.status(400).json({ success: false, message: "Error api user" })
      }
      break
    default:
      res.status(400).json({ success: false, message: "unauthorized method" })
      break
  }
}
