import express from "express";
import cors from "cors";
import catchAllRoutes from "./middleware/catchAllRoutes";
import api from "./controller";
import db from "./db/db";
import catchExceptions from "./middleware/catchExceptions";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", api);
app.use(catchExceptions);
app.use("*", catchAllRoutes);

app.listen(80, async () => {
  console.log("Listening on port 80");
  await db;
  console.log("Mongo db is connected");
});
