import { Router } from "express";
import multer from "multer";
import { authenticateToken } from "../middleware/auth";
import {
  issueCertificate,
  verifyCertificate,
  revokeCertificate,
  getCertificates,
} from "../controllers/certificateController";

const router = Router();
const upload = multer();

router.post("/", authenticateToken, issueCertificate);

router.post("/verify", upload.single("file"), verifyCertificate);

router.patch("/:id/revoke", authenticateToken, revokeCertificate);

router.get("/", authenticateToken, getCertificates);

export default router;
