import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import serviceAreaRoutes from "./routes/serviceAreaRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

// CORS — allow frontend origin in production, everything in dev
const corsOptions = {
  origin: process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL || true
    : true,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));

// Only log HTTP requests in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/service-areas", serviceAreaRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminRoutes);
app.use("/api", vendorRoutes);
app.use("/api", productRoutes);

// 404 handler for unmatched API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

app.use(errorMiddleware);

export default app;
