import express from "express";
import connDB from "./utils/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import routes from "./routes/index.js";
import userRouter from "./routes/v1/user.route.js";
import complaintRouter from "./routes/v1/complaint.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import maintenanceRoutes from "./routes/maintenance.routes.js";

const app = express();
const PORT = process.env.PORT || 5001;

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

//routes
app.use("/api/user", userRouter);
app.use("/api", routes);
app.use("/api/complaint", complaintRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/maintenance-rules", maintenanceRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
