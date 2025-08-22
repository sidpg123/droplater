import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { corsOptions } from "./lib/utils";

import { connectDB } from "./config/db";
import notesRoute from './route/notes.route';

const limiter = rateLimit({
    windowMs: 1000 * 60,
    max: 60,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
})



const PORT = 3000;


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


