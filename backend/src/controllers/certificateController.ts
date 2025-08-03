import { Request, Response } from "express";
import createcertificate from "../services/certificateService";

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

    // 4. Respond with success and the newly created certificate data
    return res.status(201).json({
      message: "Certificate issued successfully",
      certificate,
    });
  } catch (error) {
    console.error("Error issuing certificate:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
