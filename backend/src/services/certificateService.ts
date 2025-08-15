import { prisma } from '../db';  
import { generateCertificatePDF } from '../../utils/generateCertificate';

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

  // 2. Generate the PDF based on certificate data
  // You might want to pass newCertificate to include DB-generated fields if needed
  const pdfPath = await generateCertificatePDF({
    studentName: newCertificate.studentName,
    course: newCertificate.course,
    grade: newCertificate.grade,
    institutionName: newCertificate.institutionName,
    dateIssued: newCertificate.dateIssued,
  });


  // 4. Return both DB record and PDF path
  return {
    ...newCertificate,
    pdfPath,
  };
};

export default {
  createCertificate,
};
