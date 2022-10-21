// api/users.js
import bcrypt from "bcrypt"

import dbConnect from "lib/dbConnect"
import User from "models/User"

export default async function handler(req, res) {
  const { method } = req
  const { name, email, password } = req.body

  await dbConnect()

  switch (method) {
    case "POST":
      const newUser = new User({
        name,
        email,
        password: await bcrypt.hash(password, 8),
      })
      newUser.save((err, user) => {
        if (err) {
          if (err.code === 11000) {
            res.status(400).json("Email déjà utilisé")
          } else {
            res.status(400).json({ success: false })
          }
        } else {
          res.json(user)
        }
      })
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
