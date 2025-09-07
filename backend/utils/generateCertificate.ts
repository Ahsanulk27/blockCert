import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

export async function generateCertificatePDF(data: any) {
  // Load HTML template
  const templatePath = path.join(__dirname, "../templates/certificate.html");
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

  // Save PDF
  const publicDir = path.join(__dirname, "../../certificates");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const fileName = `${data.studentName}_${data.course}.pdf`;
  const outputPath = path.join(publicDir, fileName);

  // Generate PDF buffer and also persist a copy to disk for convenience
  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();

  try {
    fs.writeFileSync(outputPath, pdfBuffer);
  } catch (_) {
    // Ignore disk write errors; buffer is still returned for IPFS upload
  }

  return pdfBuffer;
}
