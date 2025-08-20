import { CorsOptions } from "cors";


export const corsOptions: CorsOptions = {
    origin: [
        "http://localhost:5001",
    ],
    methods: ['POST'],
    credentials: true
}
