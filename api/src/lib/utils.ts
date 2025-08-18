import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
    origin: [
        "http://localhost:3000",
        process.env.CLIENT_URL || 'http://localhost:3000',
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true
}