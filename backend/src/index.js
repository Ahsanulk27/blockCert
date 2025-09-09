"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const issuer_1 = __importDefault(require("./routes/issuer"));
const certificateRoutes_1 = __importDefault(require("./routes/certificateRoutes"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
// Allow requests from frontend
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use("/certificates", express_1.default.static(path_1.default.join(__dirname, "../../certificates")));
app.use(express_1.default.json());
app.use("/api/issuer", issuer_1.default);
app.use("/api/certificates", certificateRoutes_1.default);
app.get('/', (req, res) => {
    console.log("API is running");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
