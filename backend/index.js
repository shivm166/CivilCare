import express from "express";
import "dotenv/config";
import userRoutes from "./routes/user.route.js";
import connDB from "./utils/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();

const PORT = process.env.PORT || 5001;
connDB();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
