import { createNote, getNotes, retryJob } from '@/controllers/notes.controller';
import express from 'express';


// console.log(dayjs("2025-08-20T00:25:08+05:30").utc().format())

const app = express();

// app.get('/notes', async (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "Working"
//     })
// })

app.post('/notes', createNote );
app.get('/notes', getNotes);
app.post('/notes/:id/replay', retryJob);


export default app;