import { noteQueue } from '@/config/queue';
import { generateIdempotencyKey } from '@/lib/utils';
import { noteSchema } from '@/lib/zod';
import { NoteModel } from '@/models/Note.model';
import { tryCatch } from 'bullmq';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Request, Response } from 'express';
import { ZodError } from 'zod';

dayjs.extend(utc);



const createNote = async (req: Request, res: Response) => {
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

        const idempotemcyKey = generateIdempotencyKey(note._id.toString(), parsedData.releaseAt!);

        const delay = Math.max(0, dayjs(releaseAt).diff(dayjs().utc(), "millisecond"));
        // console.log("delay in ms", delay);


        await noteQueue.add("deliver-note", {
            noteId: note._id.toString(),
            webhookUrl: parsedData.webhookURL,
            title: parsedData.title,
            body: parsedData.body,
            releaseAt: parsedData.releaseAt,
            idempotemcyKey
        }, {
            delay
        })

        console.log(note);
        res.status(200).json({
            success: true,
            message: "Note added in DB",
            note
        })

    } catch (err) {
        if (err instanceof ZodError) {
            const messages = err.issues.map((e) => e.message);
            console.log(messages); // array of error messages
            res.status(400).json({
                success: false,
                message: messages
            })
        }
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

const getNotes = async (req: Request, res: Response) => {
    try {
        const { status, page = 1 } = req.query;

        const limit = 20;
        const skip = (Number(page) - 1) * limit;

        const query: any = {};
        if (status) query.status = status;

        const notes = await NoteModel.find(query)
            .skip(skip)
            .limit(limit)
            .exec();

        return res.status(200).json({
            success: true,
            data: notes
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "error while fetching data"
        });
    }
};

export {
    createNote,
    getNotes
}