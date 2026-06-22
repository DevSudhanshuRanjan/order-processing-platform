import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import serviceAreaRoutes from "./routes/serviceAreaRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/service-areas", serviceAreaRoutes);
app.use("/api", orderRoutes);
app.use("/api", vendorRoutes);
app.use("/api", adminRoutes);

app.use(errorMiddleware);

export default app;
