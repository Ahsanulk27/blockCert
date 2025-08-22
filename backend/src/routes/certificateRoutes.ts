import {Router} from "express";
import { authenticateToken } from "../middleware/auth";
import {issueCertificate, verifyCertificate} from "../controllers/certificateController";

const router = Router();

router.post("/", authenticateToken, issueCertificate);

router.get("/verify/:id", verifyCertificate);

export default router;