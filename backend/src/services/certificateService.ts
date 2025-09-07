import { prisma } from "../db";

interface CertificateInput {
  studentName: string;
  studentId: string;
  course: string;
  grade: string;
  dateIssued: Date;
  institution: string;
  notes?: string;
  issuerId: string;
}

const createCertificate = async (data: CertificateInput) => {
  // 1. Create the certificate record in DB
  const newCertificate = await prisma.certificate.create({
    data: {
      studentName: data.studentName,
      studentId: data.studentId,
      course: data.course,
      grade: data.grade,
      dateIssued: new Date(data.dateIssued),
      institutionName: data.institution,
      additionalNotes: data.notes,
      issuerId: data.issuerId,
    },
  });

  // Return only DB record; PDF generation handled in controller
  return newCertificate;
};

export default {
  createCertificate,
};
