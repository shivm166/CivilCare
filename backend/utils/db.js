import mongoose from "mongoose";
import "dotenv/config";

const mongoURI = process.env.MONGO_CONN_URI;

const connDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connDB;
