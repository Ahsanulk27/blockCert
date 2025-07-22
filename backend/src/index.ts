import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import issuerRoutes from './routes/issuer';
dotenv.config();
import cors from "cors";


const app = express();
const prisma = new PrismaClient();

// Allow requests from frontend
app.use(cors({
    origin: "http://localhost:8080", // frontend URL
    credentials: true,
  }));
  

app.use(express.json());

app.use("/api/issuer", issuerRoutes);

app.get('/', (req,res) => {
    console.log("API is running")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})