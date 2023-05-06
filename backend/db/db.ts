import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.MONGOSECRET;
const db = mongoose.connect(`mongodb://mongoadmin:${secret}@localhost:27017`, {
  dbName: "store",
});
export default db;
