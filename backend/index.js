import express from "express";
import "dotenv/config";
import connDB from "./utils/db.js";

const app = express();

const PORT = process.env.PORT || 5001;
connDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
