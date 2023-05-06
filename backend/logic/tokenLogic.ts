import jwt from "jsonwebtoken";
import { User } from "../models/User";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.SECRET ?? "";

export default function createToken(user: User) {
  return new Promise<string>((resolve, reject) => {
    try {
      const token = jwt.sign({}, secret, {
        subject: String(user._id),
        expiresIn: "24h",
      });
      resolve(token);
    } catch (e) {
      reject(e);
    }
  });
}
