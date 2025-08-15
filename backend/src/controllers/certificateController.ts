import { Request, Response } from "express";
import createcertificate from "../services/certificateService";
import { generateCertificatePDF } from "../../utils/generateCertificate";

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

    // 3. Call service to create certificate record
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

    const pdfPath = await generateCertificatePDF({
      studentName: certificate.studentName,
      course: certificate.course,
      grade: certificate.grade,
      institutionName: certificate.institutionName,
      dateIssued: certificate.dateIssued,
    });

    // Create a public URL instead of local file path
    const fileName = `${certificate.studentName}_${certificate.course}.pdf`;
    const pdfUrl =  `/certificates/${certificate.studentName}_${certificate.course}.pdf`;
    
    return res.status(201).json({
      message: "Certificate issued successfully",
      certificate,
      pdfUrl, 
    });
  } catch (error) {
    console.error("Error issuing certificate:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
