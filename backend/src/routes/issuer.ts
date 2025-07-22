// backend/src/routes/issuer.ts

import express from "express";
import {
  registerIssuer,
  loginIssuer,
  getAllIssuers
} from "./../controllers/issuerController";

const router = express.Router();

router.post("/register", registerIssuer);
router.post("/login", loginIssuer);
router.get("/", getAllIssuers);

export default router;
