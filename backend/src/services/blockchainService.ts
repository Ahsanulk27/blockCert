import { ethers } from "ethers";
import crypto from "crypto";
const contractConfig = require("../../config/contractConfig.json");

// ------------------ Blockchain Setup ------------------ //
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const contract = new ethers.Contract(
  contractConfig.address,
  contractConfig.abi,
  wallet
);

// Hash PDF 
export function generatePdfHash(pdfBuffer: Uint8Array | Buffer): string {
  const data = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
  return crypto.createHash("sha256").update(data).digest("hex");
}

// Issue a certificate on-chain (assumes PDF already uploaded to IPFS)
 
export async function issueCertificateOnChain(
  pdfBuffer: Uint8Array | Buffer,
  ipfsCid: string
): Promise<{ certId: string; certHash: string }> {
  try {
    const certHash = generatePdfHash(pdfBuffer);
    const certHashBytes32 = "0x" + certHash;

    const tx = await contract.issueCertificate(certHashBytes32, ipfsCid);
    const receipt = await tx.wait();

    let certId: string | undefined;
    const events = (receipt as any).logs || (receipt as any).events || [];
    const match = events.find(
      (e: any) =>
        e.eventName === "CertificateIssued" || e.event === "CertificateIssued"
    );
    const rawId = match?.args?.certId;
    if (rawId !== undefined && rawId !== null) {
      certId =
        typeof rawId === "bigint" ? rawId.toString() : rawId.toString?.();
    }

    if (!certId) {
      throw new Error(
        "CertificateIssued event not found in receipt; check contract address/ABI and that the event is emitted."
      );
    }

    return { certId, certHash };
  } catch (error) {
    console.error("Blockchain issueCertificateOnChain error:", error);
    throw new Error("Failed to issue certificate on-chain");
  }
}


// Verify a certificate on-chain by PDF buffer
 
export async function verifyCertificateOnChain(pdfBuffer: Buffer): Promise<{
  exists: boolean;
  revoked?: boolean;
  ipfsCid?: string;
  issuedAt?: number;
}> {
  try {
    const certHash = generatePdfHash(pdfBuffer);
    const certHashBytes32 = "0x" + certHash;

    const certId = await contract.getCertIdByHash(certHashBytes32);

    if (certId.toString() === "0") {
      return { exists: false };
    }

    const cert = await contract.getCertificateById(certId);
    return {
      exists: true,
      revoked: cert.revoked,
      ipfsCid: cert.ipfsCid,
      issuedAt: Number(cert.issuedAt),
    };
  } catch (error) {
    console.error("Blockchain verifyCertificateOnChain error:", error);
    return { exists: false };
  }
}

// Revoke a certificate on-chain by certId
export async function revokeCertificateOnChain(certId: number): Promise<void> {
  try {
    const tx = await contract.revokeCertificate(certId);
    await tx.wait();
  } catch (error) {
    console.error("Blockchain revokeCertificateOnChain error:", error);
    throw new Error("Failed to revoke certificate on-chain");
  }
}
