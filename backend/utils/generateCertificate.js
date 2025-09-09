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
exports.generateCertificatePDF = generateCertificatePDF;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const puppeteer_1 = __importDefault(require("puppeteer"));
function generateCertificatePDF(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Load HTML template
        const templatePath = path_1.default.join(__dirname, "../templates/certificate.html");
        let html = fs_1.default.readFileSync(templatePath, "utf-8");
        // Replace placeholders
        html = html
            .replace("{{CERTIFICATE_ID}}", data.id ? String(data.id) : "")
            .replace("{{STUDENT_NAME}}", data.studentName)
            .replace("{{COURSE_NAME}}", data.course)
            .replace("{{GRADE}}", data.grade)
            .replace("{{INSTITUTION}}", data.institutionName)
            .replace("{{DATE}}", data.dateIssued.toDateString());
        // Launch headless browser
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        // Set HTML content
        yield page.setContent(html, { waitUntil: "networkidle0" });
        // Generate PDF buffer and also persist a copy to disk for convenience
        const pdfBuffer = yield page.pdf({ format: "A4" });
        yield browser.close();
        return pdfBuffer;
    });
}
