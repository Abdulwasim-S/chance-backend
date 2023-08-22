import express from 'express';
import cors from 'cors';
import {} from 'dotenv/config.js'
import { db_connection } from './Database/DB.js';
import { RouterPage } from './Router/RouterPage.js';

const app = express();

//Database Connection
db_connection();

//Middlewares
app.use(cors({origin:"*"}));
app.use(express.json());

//Routers
app.use('/',RouterPage)

//Server
const PORT = process.env.PORT;
app.listen(PORT,()=>console.log("Server is Listening..."))