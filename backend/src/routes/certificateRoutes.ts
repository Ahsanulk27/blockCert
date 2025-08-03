import {Router} from "express";
import { authenticateToken } from "../middleware/auth";
import {issueCertificate} from "../controllers/certificateController";

const router = Router();

router.post("/", authenticateToken, issueCertificate);

export default router;