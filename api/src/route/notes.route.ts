import { noteSchema } from '@/lib/zod';
import { NoteModel } from '@/models/Note.model';
import express from 'express';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';

dayjs.extend(utc);

// console.log(dayjs("2025-08-20T00:25:08+05:30").utc().format())


const app = express();

app.get('/notes', async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Working"
    })
})

app.post('/notes', async (req, res) => {
    try {
        console.log("hitted");
        const parsedData = noteSchema.parse(req.body);
        console.log("parsedData", parsedData);
        const releaseAt = dayjs(parsedData.releaseAt).utc().format();
        const note = await NoteModel.create({
            releaseAt,
            webhookURL: parsedData.webhookURL,
            body: parsedData.body,
            title: parsedData.title,
            attempts: []
        })
        console.log(note);
        res.status(200).json({
            success:true,
            message: "Note added in DB", 
            note
        })
    } catch (error) {
        console.error(error)
    }

})


export default app;