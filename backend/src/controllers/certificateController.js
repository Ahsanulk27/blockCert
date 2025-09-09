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
exports.revokeCertificate = exports.getCertificates = exports.verifyCertificate = exports.issueCertificate = void 0;
const certificateService_1 = __importDefault(require("../services/certificateService"));
const generateCertificate_1 = require("../../utils/generateCertificate");
const db_1 = require("../db");
const blockchainService_1 = require("../services/blockchainService");
// Upload to IPFS via Pinata
function uploadToIpfsViaPinata(fileBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
        const form = new FormData();
        form.append("file", new Blob([fileBuffer]), "certificate.pdf");
        const headers = {
            Accept: "application/json",
        };
        if (process.env.PINATA_JWT) {
            headers.Authorization = `Bearer ${process.env.PINATA_JWT}`;
        }
        else {
            headers["pinata_api_key"] = process.env.PINATA_API_KEY || "";
            headers["pinata_secret_api_key"] = process.env.PINATA_API_SECRET || "";
        }
        const response = yield fetch(url, {
            method: "POST",
            headers,
            body: form,
        });
        const text = yield response.text();
        if (!response.ok) {
            throw new Error(`Pinata upload failed (${response.status}): ${text.substring(0, 300)}`);
        }
        let json;
        try {
            json = JSON.parse(text);
        }
        catch (_) {
            throw new Error(`Invalid JSON from Pinata: ${text.substring(0, 300)}`);
        }
        const cid = json.IpfsHash;
        if (!cid)
            throw new Error("No IpfsHash in Pinata response");
        return String(cid);
    });
}
// Issue Certificate
const issueCertificate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { studentName, studentId, course, grade, dateIssued, institution, notes, } = req.body;
        const issuerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!issuerId) {
            return res
                .status(401)
                .json({ message: "Unauthorized: Issuer info missing" });
        }
        // 1️⃣ Create certificate in DB
        const certificate = yield certificateService_1.default.createCertificate({
            studentName,
            studentId,
            course,
            grade,
            dateIssued,
            institution,
            notes,
            issuerId,
        });
        // 2️⃣ Generate PDF
        const pdfBuffer = yield (0, generateCertificate_1.generateCertificatePDF)({
            id: certificate.id,
            studentName: certificate.studentName,
            course: certificate.course,
            grade: certificate.grade,
            institutionName: certificate.institutionName,
            dateIssued: certificate.dateIssued,
        });
        // Upload PDF to IPFS (Pinata)
        const ipfsCid = yield uploadToIpfsViaPinata(pdfBuffer);
        // Push hash + IPFS CID on-chain
        const { certId, certHash } = yield (0, blockchainService_1.issueCertificateOnChain)(pdfBuffer, ipfsCid);
        // Update DB with blockchain + IPFS info
        const updatedCert = yield db_1.prisma.certificate.update({
            where: { id: certificate.id },
            data: {
                ipfsCid,
                blockchainHash: certHash,
                transactionId: certId,
            },
        });
        const pdfUrl = `https://ipfs.io/ipfs/${ipfsCid}`;
        return res.status(201).json({
            message: "Certificate issued successfully",
            certificate: updatedCert,
            certificateId: certificate.id,
            certId,
            pdfUrl,
            ipfsCid,
        });
    }
    catch (error) {
        console.error("Error issuing certificate:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.issueCertificate = issueCertificate;
// Verify Certificate
const verifyCertificate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let pdfBuffer;
        const pdfFile = req.file; // if multer is present
        if (pdfFile === null || pdfFile === void 0 ? void 0 : pdfFile.buffer) {
            pdfBuffer = pdfFile.buffer;
        }
        else if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.pdfBase64) {
            try {
                pdfBuffer = Buffer.from(req.body.pdfBase64, "base64");
            }
            catch (_b) {
                return res
                    .status(400)
                    .json({ valid: false, message: "Invalid base64 input" });
            }
        }
        else {
            return res
                .status(400)
                .json({ valid: false, message: "No file or base64 provided" });
        }
        const result = yield (0, blockchainService_1.verifyCertificateOnChain)(pdfBuffer);
        if (!result.exists) {
            return res
                .status(404)
                .json({ valid: false, message: "Certificate not found" });
        }
        // Compute hash like issuance and try to enrich from DB
        const computedHash = (0, blockchainService_1.generatePdfHash)(pdfBuffer);
        const matched = yield db_1.prisma.certificate.findFirst({
            where: { blockchainHash: computedHash },
            select: { institutionName: true, course: true },
        });
        return res.json({
            valid: true,
            revoked: result.revoked,
            ipfsCid: result.ipfsCid,
            issuedAt: result.issuedAt,
            blockchainHash: computedHash,
            institutionName: matched === null || matched === void 0 ? void 0 : matched.institutionName,
            course: matched === null || matched === void 0 ? void 0 : matched.course,
        });
    }
    catch (error) {
        console.error("Error verifying certificate:", error);
        return res
            .status(500)
            .json({ valid: false, message: "Internal server error" });
    }
});
exports.verifyCertificate = verifyCertificate;
// Get All Certificates (by issuer)
const getCertificates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const certificates = yield db_1.prisma.certificate.findMany({
            where: { issuerId: userId },
            orderBy: { dateIssued: "desc" },
        });
        res.json(certificates);
    }
    catch (error) {
        console.error("Error fetching certificates:", error);
        res.status(500).json({ message: "Error fetching certificates" });
    }
});
exports.getCertificates = getCertificates;
// Revoke Certificate
const revokeCertificate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Find certificate to get on-chain id
        const existing = yield db_1.prisma.certificate.findUnique({ where: { id } });
        if (!existing || !existing.transactionId) {
            return res.status(404).json({ message: "Certificate not found" });
        }
        // 1️⃣ Mark revoked on-chain using stored transactionId
        yield (0, blockchainService_1.revokeCertificateOnChain)(Number(existing.transactionId));
        // 2️⃣ Update DB
        const certificate = yield db_1.prisma.certificate.update({
            where: { id },
            data: { revoked: true },
        });
        res.json({ message: "Certificate revoked successfully", certificate });
    }
    catch (error) {
        console.error("Error revoking certificate:", error);
        res.status(500).json({ message: "Error revoking certificate" });
    }
});
exports.revokeCertificate = revokeCertificate;
