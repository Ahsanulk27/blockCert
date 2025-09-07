import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import {
  Upload,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Hash,
  Clock,
} from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

interface CertificateDetails {
  id: string;
  studentName: string;
  institutionName: string;
  course: string;
  dateIssued: string;
  blockchainHash: string;
}

export default function Verify() {
  const [dragActive, setDragActive] = useState(false);
  const [verificationResult, setVerificationResult] = useState<
    "verified" | "tampered" | null
  >(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [certificateDetails, setCertificateDetails] =
    useState<CertificateDetails | null>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      if (f.type !== "application/pdf") {
        alert("Please upload a PDF file");
        return;
      }
      setFile(f);
    }
  };

  const handleVerification = async () => {
    if (!file) {
      alert("Please upload a PDF first");
      return;
    }
    setIsVerifying(true);
    setVerificationResult(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await axios.post(`${API_BASE}/certificates/verify`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.valid) {
        setVerificationResult("verified");
        setCertificateDetails({
          id: "",
          studentName: "",
          institutionName: res.data.institutionName || "",
          course: res.data.course,
          dateIssued: res.data.issuedAt
            ? new Date(res.data.issuedAt * 1000).toISOString()
            : "",
          blockchainHash: res.data.blockchainHash?.startsWith("0x")
            ? res.data.blockchainHash
            : res.data.blockchainHash
            ? `0x${res.data.blockchainHash}`
            : "",
        });
      } else {
        setVerificationResult("tampered");
        setCertificateDetails(null);
      }
    } catch (err) {
      console.error(err);
      setVerificationResult("tampered");
      setCertificateDetails(null);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-glow">Verify</span> Certificate
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enter certificate ID or hash to instantly verify authenticity
              against our blockchain records.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Upload Section */}
            <Card className="card-blockchain p-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Upload className="w-6 h-6 text-primary" />
                Upload Certificate (PDF)
              </h2>
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-card-border hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium mb-2">
                      Drop your certificate here
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports PDF files
                    </p>
                    <input
                      ref={fileInputRef}
                      id="pdfInput"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose File
                    </Button>
                    {file && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Selected: {file.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  onClick={handleVerification}
                  variant="cyber"
                  size="lg"
                  className="w-full"
                  disabled={isVerifying || !file}
                >
                  {isVerifying ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Upload & Verify
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <Card
              className={`card-blockchain p-8 mt-8 animate-scale-in ${
                verificationResult === "verified"
                  ? "border-success/30 bg-success/5"
                  : "border-destructive/30 bg-destructive/5"
              }`}
            >
              <div className="text-center">
                {verificationResult === "verified" && certificateDetails ? (
                  <>
                    <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-success mb-2">
                      Certificate Verified ✓
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      This certificate is authentic and has not been tampered
                      with.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-card p-4 rounded-lg">
                        <div className="font-medium">Blockchain Hash</div>
                        <div className="font-mono text-xs text-primary break-all">
                          {certificateDetails.blockchainHash}
                        </div>
                      </div>
                      <div className="bg-card p-4 rounded-lg">
                        <div className="font-medium">Issued Date</div>
                        <div className="text-muted-foreground">
                          {new Date(
                            certificateDetails.dateIssued
                          ).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="bg-card p-4 rounded-lg">
                        <div className="font-medium">Institution</div>
                        <div className="text-muted-foreground">
                          {certificateDetails.institutionName}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-destructive mb-2">
                      Certificate Invalid ✗
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      This certificate has been tampered with or is not in our
                      blockchain records.
                    </p>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <div className="text-sm text-destructive">
                        ⚠️ Warning: This certificate cannot be trusted. Contact
                        the issuing institution for verification.
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
