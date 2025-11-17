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
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Sahi tareeke se routes ko use karein
app.use("/api", routes); // Yeh 'index.js' routes ko handle karega (jaise auth routes)
app.use("/api/user", userRouter);
app.use("/api/society", societyRouter); // Sirf ek baar use karein
app.use("/api/complaint", complaintRouter);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
