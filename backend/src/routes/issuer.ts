// backend/src/routes/issuer.ts

import express from "express";
import {
  registerIssuer,
  loginIssuer,
  getAllIssuers
} from "../controllers/issuerController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Public routes
router.post("/register", registerIssuer);
router.post("/login", loginIssuer);

// Protected routes - require authentication
router.get("/", authenticateToken, getAllIssuers);


export default router;
