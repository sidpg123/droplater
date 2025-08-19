import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit";
import { corsOptions } from "./lib/utils";

import notesRoute from './route/notes.route'
import { connectDB } from "./config/db";

const limiter = rateLimit({
    windowMs: 1000 * 60,
    max: 60,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
})

dotenv.config({
    path: '../.env'
})

const PORT = 5000;


connectDB();
const app = express();

app.use(express.json());
app.use(limiter);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(helmet());


app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "server is running"
    })
})

app.use('/api', notesRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


