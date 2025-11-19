import express from "express";
import connDB from "./utils/db.js"; // <-- Yakeen karein ki file utils/db.js mein hai
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import routes from "./routes/index.js";
import userRouter from "./routes/user.route.js";
import societyRouter from "./routes/society.route.js";
import complaintRouter from "./routes/complaint.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();
const PORT = process.env.PORT || 5001;

// Database connect karein
connDB();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://civilcare.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api", routes);
app.use("/api/society", societyRouter);
app.use("/api/complaint", complaintRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
