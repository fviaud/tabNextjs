import jsonwebtoken from "jsonwebtoken"
import dbConnect from "lib/dbConnect"
import User from "models/user"
import { keyPub } from "keys"

export default async function handler(req, res) {
  const { method } = req
  switch (method) {
    case "GET":
      const { token } = req.cookies
      if (token) {
        try {
          const decodedToken = jsonwebtoken.verify(token, await keyPub())
          try {
            await dbConnect()
            const currentUser = await User.findById(decodedToken.sub).select("-password -__v").exec()
            if (currentUser) {
              return res.status(200).json(currentUser)
            } else {
              res.status(400).json({ success: false, message: "User not find" })
            }
          } catch (error) {
            res.status(400).json({ success: false, message: "Error api user" })
          }
        } catch (error) {
          res.status(400).json({ success: false, message: "Error token" })
        }
      } else {
        res.status(400).json({ success: false, message: "No token" })
      }

      break
    default:
      res.status(400).json({ success: false, message: "unauthorized method" })
      break
  }
}
