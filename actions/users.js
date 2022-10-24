import bcrypt from "bcrypt"

import dbConnect from "lib/dbConnect"
import User from "models/user"

export async function checkUser(email, password, picture) {
  await dbConnect()
  const newUser = new User({
    email,
    ...(password && { password: await bcrypt.hash(password, 8) }),
    picture,
  })
  try {
    const user = await newUser.save()
    const { _id: id } = user
    return { success: true, id }
  } catch (error) {
    if (error.code === 11000) {
      return { success: false, message: "Email already used" }
    }
  }
}
