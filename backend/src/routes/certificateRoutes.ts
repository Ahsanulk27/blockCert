import {Router} from "express";
import { authenticateToken } from "../middleware/auth";
import {issueCertificate, verifyCertificate, revokeCertificate, getCertificates} from "../controllers/certificateController";

const router = Router();

router.post("/", authenticateToken, issueCertificate);

router.get("/verify/:id", verifyCertificate);

router.patch("/:id/revoke", authenticateToken, revokeCertificate); 

router.get("/", authenticateToken, getCertificates);

export default router;