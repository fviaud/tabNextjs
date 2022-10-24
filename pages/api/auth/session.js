import jsonwebtoken from "jsonwebtoken"
import dbConnect from "lib/dbConnect"
import User from "models/user"
import { keyPub } from "keys"

export default async function handler(req, res) {
  const { method } = req
  switch (method) {
    case "GET":
      await dbConnect()
      const { token } = req.cookies
      if (token) {
        try {
          const decodedToken = jsonwebtoken.verify(token, await keyPub())
          const currentUser = await User.findById(decodedToken.sub).select("-password -__v").exec()
          if (currentUser) {
            return res.json(currentUser)
          } else {
            res.status(400).json({ success: false })
          }
        } catch (e) {
          res.status(400).json({ success: false })
        }
      } else {
        res.status(400).json({ success: "toto" })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
