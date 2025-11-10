import express from "express";
import userRouter from "./routes/user.route.js";
import connDB from "./utils/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import societyRouter from "./routes/society.route.js";
import complaintRoutes from "../backend/routes/complaint.routes.js";
import requestRouter from "./routes/request.route.js"; // ⬅️ ADD THIS LINE
import attachSocietyContext from "./middlelware/attachSocietyContext.js";

const app = express();
const PORT = process.env.PORT || 5001;

connDB();

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
app.use(attachSocietyContext);

app.use("/api/user", userRouter);
app.use("/api/society", societyRouter);
app.use("/api/complaints", complaintRoutes);
app.use("/api/request", requestRouter); // ⬅️ ADD THIS LINE

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
