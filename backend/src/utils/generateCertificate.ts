import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

export async function generateCertificatePDF(data: any) {
  // Load HTML template
  const templatePath = path.join(__dirname, "../templates/certificateTemplate.html");
  let html = fs.readFileSync(templatePath, "utf-8");

  // Replace placeholders
  html = html
    .replace("{{CERTIFICATE_ID}}", data.id ? String(data.id) : "")
    .replace("{{STUDENT_NAME}}", data.studentName)
    .replace("{{COURSE_NAME}}", data.course)
    .replace("{{GRADE}}", data.grade)
    .replace("{{INSTITUTION}}", data.institutionName)
    .replace("{{DATE}}", data.dateIssued.toDateString());

  // Launch headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set HTML content
  await page.setContent(html, { waitUntil: "networkidle0" });

  // Generate PDF buffer and also persist a copy to disk for convenience
  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();

  return pdfBuffer;
}
