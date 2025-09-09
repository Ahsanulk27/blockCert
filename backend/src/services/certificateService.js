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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const createCertificate = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Create the certificate record in DB
    const newCertificate = yield db_1.prisma.certificate.create({
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
});
exports.default = {
    createCertificate,
};
