// 서버 실행 파일

import express from 'express';
import router from './routes/routes.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
}));

app.get("/", (req, res) => {
    res.json({message: "Todos Project by WeavFlow"})
})

app.use("/todos", router);

export default app;