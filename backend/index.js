import express from "express";
import userRouter from "./routes/user.route.js";
import connDB from "./utils/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import societyRouter from "./routes/society.route.js";
import attachSocietyContext from "./middlelware/attachSocietyContext.js";

const app = express();

const PORT = process.env.PORT || 5001;
connDB();

app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend or Postman domain
    credentials: true, // ✅ allows cookies
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(attachSocietyContext);

app.use("/api/user", userRouter);
app.use("/api/society", societyRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
