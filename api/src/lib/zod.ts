import z from 'zod';

export const noteSchema  = z.object({
    _id: z.string().optional(),
    title: z.string().nonempty("Title shouldn't be empty"),
    body: z.string().nonempty("Note body can't be empty"),
    webhookURL: z.string().nonempty("webhookURL is required"),
    releaseAt: z.string().optional(),
})

export type noteType = z.infer<typeof noteSchema>;
