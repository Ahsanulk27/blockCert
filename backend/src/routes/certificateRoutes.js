"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const certificateController_1 = require("../controllers/certificateController");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.post("/", auth_1.authenticateToken, certificateController_1.issueCertificate);
router.post("/verify", upload.single("file"), certificateController_1.verifyCertificate);
router.patch("/:id/revoke", auth_1.authenticateToken, certificateController_1.revokeCertificate);
router.get("/", auth_1.authenticateToken, certificateController_1.getCertificates);
exports.default = router;
