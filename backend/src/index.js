import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {connectDB} from './lib/connectDB.js'

import authRoutes from "./routers/authRoutes.js";

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
    res.send("Assalam -o- Alaikum!!!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\nClicky here: http://localhost:${PORT}`);
    connectDB();
});