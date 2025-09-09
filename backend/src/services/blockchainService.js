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
exports.generatePdfHash = generatePdfHash;
exports.issueCertificateOnChain = issueCertificateOnChain;
exports.verifyCertificateOnChain = verifyCertificateOnChain;
exports.revokeCertificateOnChain = revokeCertificateOnChain;
const ethers_1 = require("ethers");
const crypto_1 = __importDefault(require("crypto"));
const contractConfig = require("../../config/contractConfig.json");
// ------------------ Blockchain Setup ------------------ //
const provider = new ethers_1.ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers_1.ethers.Contract(contractConfig.address, contractConfig.abi, wallet);
// Hash PDF 
function generatePdfHash(pdfBuffer) {
    const data = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
    return crypto_1.default.createHash("sha256").update(data).digest("hex");
}
// Issue a certificate on-chain (assumes PDF already uploaded to IPFS)
function issueCertificateOnChain(pdfBuffer, ipfsCid) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const certHash = generatePdfHash(pdfBuffer);
            const certHashBytes32 = "0x" + certHash;
            const tx = yield contract.issueCertificate(certHashBytes32, ipfsCid);
            const receipt = yield tx.wait();
            let certId;
            const events = receipt.logs || receipt.events || [];
            const match = events.find((e) => e.eventName === "CertificateIssued" || e.event === "CertificateIssued");
            const rawId = (_a = match === null || match === void 0 ? void 0 : match.args) === null || _a === void 0 ? void 0 : _a.certId;
            if (rawId !== undefined && rawId !== null) {
                certId =
                    typeof rawId === "bigint" ? rawId.toString() : (_b = rawId.toString) === null || _b === void 0 ? void 0 : _b.call(rawId);
            }
            if (!certId) {
                throw new Error("CertificateIssued event not found in receipt; check contract address/ABI and that the event is emitted.");
            }
            return { certId, certHash };
        }
        catch (error) {
            console.error("Blockchain issueCertificateOnChain error:", error);
            throw new Error("Failed to issue certificate on-chain");
        }
    });
}
// Verify a certificate on-chain by PDF buffer
function verifyCertificateOnChain(pdfBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const certHash = generatePdfHash(pdfBuffer);
            const certHashBytes32 = "0x" + certHash;
            const certId = yield contract.getCertIdByHash(certHashBytes32);
            if (certId.toString() === "0") {
                return { exists: false };
            }
            const cert = yield contract.getCertificateById(certId);
            return {
                exists: true,
                revoked: cert.revoked,
                ipfsCid: cert.ipfsCid,
                issuedAt: Number(cert.issuedAt),
            };
        }
        catch (error) {
            console.error("Blockchain verifyCertificateOnChain error:", error);
            return { exists: false };
        }
    });
}
// Revoke a certificate on-chain by certId
function revokeCertificateOnChain(certId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tx = yield contract.revokeCertificate(certId);
            yield tx.wait();
        }
        catch (error) {
            console.error("Blockchain revokeCertificateOnChain error:", error);
            throw new Error("Failed to revoke certificate on-chain");
        }
    });
}
