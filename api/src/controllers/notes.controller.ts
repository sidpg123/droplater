import { noteQueue } from '@/config/queue';
import { generateIdempotencyKey } from '@/lib/utils';
import { noteSchema } from '@/lib/zod';
import { NoteModel } from '@/models/Note.model';
import { tryCatch } from 'bullmq';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Request, Response } from 'express';
import { success, ZodError } from 'zod';

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
        console.log("releaseId", releaseAt);
        const idempotencyKey = generateIdempotencyKey(note._id.toString(), releaseAt);
        console.log("idempotencyKey", idempotencyKey);
        const delay = Math.max(0, dayjs(releaseAt).diff(dayjs().utc(), "millisecond"));
        // console.log("delay in ms", delay);


        await noteQueue.add("deliver-note", {
            noteId: note._id.toString(),
            webhookUrl: parsedData.webhookURL,
            title: parsedData.title,
            body: parsedData.body,
            releaseAt: releaseAt,
            idempotencyKey
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
        const { status } = req.query;
        const page = req.query.page ? Number(req.query.page) : 1;

        const limit = 20;
        const skip = (page - 1) * limit;

        const query: any = {};
        if (status) query.status = String(status);

        console.log("req.query : ", req.query);
        console.log("query : ", query);

        // Fetch notes
        const notes = await NoteModel.find(query)
            .skip(skip)
            .limit(limit)
            .exec();

        const totalDocs = await NoteModel.countDocuments(query);
        const totalPages = Math.ceil(totalDocs / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return res.status(200).json({
            success: true,
            data: notes,
            pagination: {
                totalDocs,
                totalPages,
                currentPage: page,
                hasNextPage,
                hasPrevPage,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "error while fetching data",
        });
    }
};



const retryJob = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const note = await NoteModel.findById(id);

        if (!note) {
            return res.status(400).json({
                success: false,
                message: "note not found"
            })
        }

        // if(note.status !== "failed") {
        //     return res.status(400).json({
        //         success: false,
        //         message: `Request is ${note.status}`
        //     })
        // }
        
        const releaseAt = dayjs(note.releaseAt).utc().format();
        // console.log("note.releaseAt", (note.releaseAt).toString());
        console.log("release at in retry", releaseAt)
        const idempotencyKey = generateIdempotencyKey(note._id.toString(), releaseAt);
        // console.log()
        await noteQueue.add("deliver-note", {
            noteId: note._id,
            webhookUrl: note.webhookURL,
            title: note.title,
            body: note.body,
            releaseAt: dayjs().utc(),
            idempotencyKey
        })

        return res.status(200).json({
            success: true,
            message: "Retrying job"
        })

    } catch (error) {
        console.log(error);
    }
}

export {
    createNote,
    getNotes,
    retryJob
}