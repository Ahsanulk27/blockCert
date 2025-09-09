import { Request, Response } from "express";
import createcertificate from "../services/certificateService";
import { generateCertificatePDF } from "../../utils/generateCertificate";
import { prisma } from "../db";
import {
  issueCertificateOnChain,
  verifyCertificateOnChain,
  revokeCertificateOnChain,
  generatePdfHash,
} from "../services/blockchainService";

// Upload to IPFS via Pinata
async function uploadToIpfsViaPinata(fileBuffer: Buffer): Promise<string> {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(fileBuffer)]), "certificate.pdf");

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (process.env.PINATA_JWT) {
    headers.Authorization = `Bearer ${process.env.PINATA_JWT}`;
  } else {
    headers["pinata_api_key"] = process.env.PINATA_API_KEY || "";
    headers["pinata_secret_api_key"] = process.env.PINATA_API_SECRET || "";
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: form as any,
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(
      `Pinata upload failed (${response.status}): ${text.substring(0, 300)}`
    );
  }
  let json: any;
  try {
    json = JSON.parse(text);
  } catch (_) {
    throw new Error(`Invalid JSON from Pinata: ${text.substring(0, 300)}`);
  }
  const cid = json.IpfsHash;
  if (!cid) throw new Error("No IpfsHash in Pinata response");
  return String(cid);
}


// Issue Certificate
export const issueCertificate = async (req: Request, res: Response) => {
  try {
    const {
      studentName,
      studentId,
      course,
      grade,
      dateIssued,
      institution,
      notes,
    } = req.body;

    const issuerId = req.user?.id;
    if (!issuerId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Issuer info missing" });
    }

    // 1️⃣ Create certificate in DB
    const certificate = await createcertificate.createCertificate({
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
    const pdfBuffer = await generateCertificatePDF({
      id: certificate.id,
      studentName: certificate.studentName,
      course: certificate.course,
      grade: certificate.grade,
      institutionName: certificate.institutionName,
      dateIssued: certificate.dateIssued,
    });

    // Upload PDF to IPFS (Pinata)
    const ipfsCid = await uploadToIpfsViaPinata(pdfBuffer as Buffer);

    // Push hash + IPFS CID on-chain
    const { certId, certHash } = await issueCertificateOnChain(
      pdfBuffer as any,
      ipfsCid
    );

    // Update DB with blockchain + IPFS info
    const updatedCert = await prisma.certificate.update({
      where: { id: certificate.id },
      data: {
        ipfsCid,
        blockchainHash: certHash,
        transactionId: certId,
      } as any,
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
  } catch (error) {
    console.error("Error issuing certificate:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Verify Certificate
export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    let pdfBuffer: Buffer;
    const pdfFile = (req as any).file; // if multer is present
    if (pdfFile?.buffer) {
      pdfBuffer = pdfFile.buffer;
    } else if (req.body?.pdfBase64) {
      try {
        pdfBuffer = Buffer.from(req.body.pdfBase64, "base64");
      } catch {
        return res
          .status(400)
          .json({ valid: false, message: "Invalid base64 input" });
      }
    } else {
      return res
        .status(400)
        .json({ valid: false, message: "No file or base64 provided" });
    }
    const result = await verifyCertificateOnChain(pdfBuffer);

    if (!result.exists) {
      return res
        .status(404)
        .json({ valid: false, message: "Certificate not found" });
    }

    // Compute hash like issuance and try to enrich from DB
    const computedHash = generatePdfHash(pdfBuffer);
    const matched = await prisma.certificate.findFirst({
      where: { blockchainHash: computedHash },
      select: { institutionName: true, course: true },
    });

    return res.json({
      valid: true,
      revoked: result.revoked,
      ipfsCid: result.ipfsCid,
      issuedAt: result.issuedAt,
      blockchainHash: computedHash,
      institutionName: matched?.institutionName,
      course: matched?.course,
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return res
      .status(500)
      .json({ valid: false, message: "Internal server error" });
  }
};

// Get All Certificates (by issuer)
export const getCertificates = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const certificates = await prisma.certificate.findMany({
      where: { issuerId: userId },
      orderBy: { dateIssued: "desc" },
    });
    res.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ message: "Error fetching certificates" });
  }
};


// Revoke Certificate
export const revokeCertificate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find certificate to get on-chain id
    const existing = await prisma.certificate.findUnique({ where: { id } });
    if (!existing || !existing.transactionId) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // 1️⃣ Mark revoked on-chain using stored transactionId
    await revokeCertificateOnChain(Number(existing.transactionId));

    // 2️⃣ Update DB
    const certificate = await prisma.certificate.update({
      where: { id },
      data: { revoked: true },
    });

    res.json({ message: "Certificate revoked successfully", certificate });
  } catch (error) {
    console.error("Error revoking certificate:", error);
    res.status(500).json({ message: "Error revoking certificate" });
  }
};
