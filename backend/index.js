import express from "express";
import userRouter from "./routes/user.route.js";
import connDB from "./utils/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import societyRouter from "./routes/society.route.js";
import requestRouter from "./routes/admin/request.route.js";
import attachSocietyContext from "./middlelware/attachSocietyContext.js";
import complaintRouter from "./routes/complaint.routes.js";
import memberRoute from "./routes/admin/member.route.js";
import activationRoute from "./routes/admin/activation.route.js";
import routes from "./routes/index.js";

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

app.use("/api", routes);
app.use("/api/user", userRouter);
app.use("/api/society", societyRouter);
app.use("/api/request", requestRouter);
app.use("/api/complaint", complaintRouter);

app.use("/api/member", memberRoute);
app.use("/api/activation", activationRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
