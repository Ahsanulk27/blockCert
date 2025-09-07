import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import issuerRoutes from './routes/issuer';
import certificateRoutes from "./routes/certificateRoutes";
dotenv.config();
import cors from "cors";
import path from 'path';


const app = express();
const prisma = new PrismaClient();

// Allow requests from frontend
app.use(cors({
    origin: "http://localhost:8080", 
    credentials: true,
  }));
  
app.use("/certificates", express.static(path.join(__dirname, "../../certificates")));


app.use(express.json());

app.use("/api/issuer", issuerRoutes);
app.use("/api/certificates", certificateRoutes);


app.get('/', (req,res) => {
    console.log("API is running")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})