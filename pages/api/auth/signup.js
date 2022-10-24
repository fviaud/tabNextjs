// api/users.js
import { checkUser } from "actions/users"
// import bcrypt from "bcrypt"

import dbConnect from "lib/dbConnect"
// import User from "models/User"

export default async function handler(req, res) {
  const { method } = req
  const { email, password } = req.body
  switch (method) {
    case "POST":
      const response = await checkUser(email, password)
      console.log(response)
      res.status(400).json(response)
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
