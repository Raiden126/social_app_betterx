import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from "passport";
import session from "express-session";

import "./config/passport.js";
<<<<<<< HEAD
import userRoutes from './routes/auth.routes.js';
=======
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js'
>>>>>>> a4b1c728d9c3f2c9fbd997fae42d8b1927b863b1

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

<<<<<<< HEAD
app.use('/api/users', userRoutes);
=======
app.use('/api/users', authRoutes);
app.use('/api/v1/users', userRoutes);
>>>>>>> a4b1c728d9c3f2c9fbd997fae42d8b1927b863b1

app.get('/', (req, res) => {
    res.send('Hello World!');
})

export {app}