import { prisma } from '../db';  

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
  // Insert certificate into DB
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

  return newCertificate;
};

export default {
  createCertificate,
};
