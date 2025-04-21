import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./db/index.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
