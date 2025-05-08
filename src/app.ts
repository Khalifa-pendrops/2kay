import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mainRoute from "./routes/index.route";
import connectDB from "./config/database";
import { sendErrorResponse } from "./utils/apiResponse";

const app = express();

connectDB();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1", mainRoute);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// 404 handler just in case
app.use((req, res) => {
  sendErrorResponse(res, "Route not found", null, 404);
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  sendErrorResponse(res, "Something went wrong", err.message, 500);
});

export default app;
