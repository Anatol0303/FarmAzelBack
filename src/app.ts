
// import 'reflect-metadata';
// import express, {Application, NextFunction, Request, Response} from 'express';
// import {useExpressServer} from "routing-controllers";
// import ClientController from "./client/controllers/ClientController";
// import dotenv from 'dotenv';
// import * as mongoose from "mongoose";
// import FarmerController from "./farmer/controllers/FarmerController";
// import cors from 'cors';
//
//
// dotenv.config();
//
// mongoose.connect(process.env.MONGO_URI!)
//     .then(() => console.log("Connected to MongoDB"))
//     .catch((err) =>{
//         console.error('MongoDb connection error: ' + err);
//         process.exit(1);
//     })
//
// const app: Application = express();
// const PORT = 8080;
//
// app.use(express.json());
// //app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
// //app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
// app.use(cors());
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     console.error(err.message);
//     res.status(400).json({error: err.message});
// })
//
// useExpressServer(app, {
//     controllers: [ClientController, FarmerController],
//     defaultErrorHandler: false, // подключает твой обработчик ошибок
//     development: true,
// });
//
// // useExpressServer(app, {
// //     controllers: [ClientController,
// //         FarmerController]
// // });
//
// async function startServer() {
//     app.listen(PORT, () => {
//         console.log(`http://localhost:${PORT}`);
//     })
// }
//
// startServer().catch(console.error);
// //----------------------------------------------------------------------------------------------------------------------------

import "reflect-metadata";
import express from "express";
//import './types/express/index';
//import './types/express';
import { useExpressServer } from "routing-controllers";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import ClientController from "./client/controllers/ClientController";
//import FarmerController from "./farmer/controllers/FarmerController";
import FarmerController from "./farmer/controllers/FarmerController";

dotenv.config();

mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("MongoDb connection error: " + err);
        process.exit(1);
    });

const app = express();
const PORT = 8080;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is working 🚀");
});

useExpressServer(app, {
    controllers: [ClientController, FarmerController],
    defaultErrorHandler: false, // отключаем встроенный — чтобы наш global middleware работал
    development: true,
});

// Кастомный глобальный обработчик ошибок
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Global error handler:", err.message);
    res.status(err.httpCode || 500).json({ message: err.message || "Unexpected error" });
});

app.listen(PORT, () => {
    console.log(`Server is running: http://localhost:${PORT}`);
});
