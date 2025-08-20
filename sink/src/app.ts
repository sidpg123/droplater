import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import { corsOptions } from './lib/utils';
import cookieParser from 'cookie-parser';
import { redis } from './config/redis';



const app = express()

const PORT = 5001


app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions))
app.use(cookieParser());


app.post('/sink', async (req: Request, res) => {

    if (process.env.WEBHOOK === "OFF") {
        return res.status(500).json({
            success: "false",
            message: "Server down"
        })
    }

    const idempotencyKey = req.header("X-Idempotency-Key");

    if (!idempotencyKey) {
        return res.status(400).json({ error: "Missing X-Idempotency-Key header" });
    }

    try {
        // SET key if not exists, expire in 1 day (86400 seconds)
        const wasSet = await redis.setnx(idempotencyKey, 1);


        if (wasSet === 0) {
            // Already processed → duplicate
            return res.status(200).json({ message: "Duplicate ignored" });
        }

        console.log("Sink received delivery:", req.body);

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("❌ Redis error:", err);
        return res.status(500).json({ error: "Internal error" });
    }

})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


