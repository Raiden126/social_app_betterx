import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/auth.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(cookieParser());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
})

export {app}