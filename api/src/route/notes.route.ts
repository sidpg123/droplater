import express from 'express';

const app = express();

app.get('/notes', async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Working"
    })
})


export default app;