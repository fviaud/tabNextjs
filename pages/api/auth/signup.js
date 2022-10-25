import bcrypt from "bcrypt"

import dbConnect from "lib/dbConnect"
import User from "models/user"

export default async function handler(req, res) {
  const { method } = req
  switch (method) {
    case "POST":
      try {
        const { email, password } = req.body
        await dbConnect()
        const newUser = new User({
          email,
          password: await bcrypt.hash(password, 8),
        })
        newUser.save((err, user) => {
          if (err) {
            if (err.code === 11000) {
              res.status(400).json({ success: false, message: "Email already used" })
            } else {
              res.status(400).json({ success: false, message: "Error api users" })
            }
          } else {
            res.status(200).json({ success: true })
          }
        })
      } catch (error) {
        res.status(400).json({ success: false, message: "Error api users" })
      }
      break
    default:
      res.status(400).json({ success: false, message: "unauthorized method" })
      break
  }
}
