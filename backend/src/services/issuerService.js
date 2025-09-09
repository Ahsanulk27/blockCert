"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllIssuers = exports.loginIssuer = exports.registerIssuer = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
}
const registerIssuer = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, email, password, }) {
    const existing = yield prisma.issuer.findUnique({ where: { email } });
    if (existing)
        throw new Error("Issuer already exists");
    const hashed = yield bcryptjs_1.default.hash(password, 10);
    const issuer = yield prisma.issuer.create({
        data: { name, email, password: hashed },
    });
    return issuer;
});
exports.registerIssuer = registerIssuer;
const loginIssuer = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, }) {
    const issuer = yield prisma.issuer.findUnique({ where: { email } });
    if (!issuer)
        throw new Error("Invalid credentials");
    const match = yield bcryptjs_1.default.compare(password, issuer.password);
    if (!match)
        throw new Error("Invalid credentials");
    const token = jsonwebtoken_1.default.sign({ id: issuer.id, email: issuer.email }, JWT_SECRET, {
        expiresIn: "7d",
    });
    return token;
});
exports.loginIssuer = loginIssuer;
const getAllIssuers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.issuer.findMany({
        select: { id: true, name: true, email: true, createdAt: true },
    });
});
exports.getAllIssuers = getAllIssuers;
