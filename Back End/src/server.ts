import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose'
import authRoute from './modules/auth/auth.routes'
import cors from 'cors';
dotenv.config();

const app = express();
app.use(cors())
app.use(cors({
  origin:"http://localhost:5173",credentials:true
}
))
app.use(express.json())
const port: number = Number(process.env.PORT) || 8100;


 mongoose.connect(process.env.DB as string )
.then(() => console.log("Database connected"))
.catch((error) => console.log('Mongo DB error',error));
app.use('/api',authRoute);




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
