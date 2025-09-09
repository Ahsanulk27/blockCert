"use strict";
// backend/src/routes/issuer.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const issuerController_1 = require("../controllers/issuerController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.post("/register", issuerController_1.registerIssuer);
router.post("/login", issuerController_1.loginIssuer);
// Protected routes - require authentication
router.get("/", auth_1.authenticateToken, issuerController_1.getAllIssuers);
exports.default = router;
