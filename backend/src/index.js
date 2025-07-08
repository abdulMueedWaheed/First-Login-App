import express from "express";
import dotenv from "dotenv";
import path from "path";

// Load environment variables first
dotenv.config();

import cookieParser from "cookie-parser";
import supabase from "./lib/supabase_connect.js";
import authRoutes from "./routers/authRoutes.js";
import productRoutes from "./routers/productRoutes.js";
import orderRoutes from "./routers/orderRoutes.js";

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get('/', (req, res) => {
    res.send("Assalam -o- Alaikum!!!");
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\nClicky here: http://localhost:${PORT}`);
});