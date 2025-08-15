import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import {
  Shield,
  Upload,
  User,
  GraduationCap,
  Calendar,
  FileText,
  Hash,
  CheckCircle2,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

export default function Issue() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [certificateData, setCertificateData] = useState({
    studentName: "",
    studentId: "",
    course: "",
    grade: "",
    dateIssued: "",
    institution: "",
    notes: "",
  });
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/certificates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(certificateData),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Something went wrong");

      // Set the download URL from the API response
      setDownloadUrl(result.pdfUrl);
      setIsProcessing(false);
      setStep(4);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
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
              <span className="text-cyber-glow">Issue</span> Certificate
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create tamper-proof digital certificates secured by blockchain
              technology. Perfect for educational institutions and certification
              bodies.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step >= stepNum
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > stepNum ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      stepNum
                    )}
                  </div>
                  {stepNum < 4 && (
                    <div
                      className={`w-12 h-0.5 transition-colors duration-300 ${
                        step > stepNum ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {step === 1 && (
            <Card className="card-blockchain p-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">
                  Authentication Required
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4 justify-center">
                    <GraduationCap className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Institution Portal</h3>
                      <p className="text-sm text-muted-foreground">
                        Secure access for authorized institutions
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-1 w-full max-w-lg">
                      <Input
                        name="institution"
                        placeholder="Institution Name"
                        value={certificateData.institution}
                        onChange={(e) =>
                          setCertificateData({
                            ...certificateData,
                            institution: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Authenticate & Continue
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Don't have access?{" "}
                  <a href="#" className="text-primary hover:underline">
                    Contact us
                  </a>{" "}
                  for institutional registration.
                </p>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className="card-blockchain p-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-secondary" />
                <h2 className="text-2xl font-semibold">Certificate Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Student Name
                    </label>
                    <Input
                      name="studentName"
                      placeholder="Full name as it appears on records"
                      value={certificateData.studentName}
                      onChange={(e) =>
                        setCertificateData({
                          ...certificateData,
                          studentName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Student ID
                    </label>
                    <Input
                      name="studentId"
                      placeholder="Unique student identifier"
                      value={certificateData.studentId}
                      onChange={(e) =>
                        setCertificateData({
                          ...certificateData,
                          studentId: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Course/Program
                    </label>
                    <Input
                      name="course"
                      placeholder="Course name or program title"
                      value={certificateData.course}
                      onChange={(e) =>
                        setCertificateData({
                          ...certificateData,
                          course: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Grade/Score
                    </label>
                    <Input
                      name="grade"
                      placeholder="Final grade or score"
                      value={certificateData.grade}
                      onChange={(e) =>
                        setCertificateData({
                          ...certificateData,
                          grade: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date Issued
                    </label>
                    <Input
                      name="dateIssued"
                      type="date"
                      value={certificateData.dateIssued}
                      onChange={(e) =>
                        setCertificateData({
                          ...certificateData,
                          dateIssued: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Additional Notes
                    </label>
                    <Textarea
                      name="notes"
                      placeholder="Optional additional information"
                      className="resize-none"
                      rows={3}
                      value={certificateData.notes || ""}
                      onChange={(e) =>
                        setCertificateData({
                          ...certificateData,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep(3)}
                variant="cyber"
                size="lg"
                className="w-full mt-6"
              >
                Continue to Upload
              </Button>
            </Card>
          )}

          {step === 3 && (
            <Card className="card-blockchain p-8 animate-fade-in">
              <div className="space-y-6">
                {/* Preview */}
                <div className="bg-muted/20 rounded-lg p-6">
                  <h3 className="font-medium mb-4">Certificate Preview</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Student:</span>{" "}
                      {certificateData.studentName || "Not specified"}
                    </div>
                    <div>
                      <span className="font-medium">Course:</span>{" "}
                      {certificateData.course || "Not specified"}
                    </div>
                    <div>
                      <span className="font-medium">Grade:</span>{" "}
                      {certificateData.grade || "Not specified"}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span>{" "}
                      {certificateData.dateIssued || "Not specified"}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Hash className="w-5 h-5 mr-2 animate-spin" />
                      Processing & Storing on Blockchain...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Issue Certificate
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}

          {step === 4 && (
            <Card className="card-blockchain p-8 animate-scale-in border-success/30 bg-success/5">
              <div className="text-center">
                <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-success mb-4">
                  Certificate Successfully Issued!
                </h2>
                <p className="text-muted-foreground mb-8">
                  Your certificate has been securely stored on the blockchain
                  and is now available for verification.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-card p-6 rounded-lg">
                    <h3 className="font-semibold mb-3">Certificate Details</h3>
                    <div className="space-y-2 text-sm text-left">
                      <div className="flex justify-between">
                        <span>Certificate ID:</span>
                        <span className="font-mono">CERT-2024-001</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Blockchain Hash:</span>
                        <span className="font-mono text-primary">
                          0x7d4a...9f2e
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Block Number:</span>
                        <span>18,745,123</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card p-6 rounded-lg">
                    <h3 className="font-semibold mb-3">Verification URL</h3>
                    <div className="text-sm">
                      <code className="bg-muted p-2 rounded text-xs break-all block mb-3">
                        https://blockcert.com/verify/CERT-2024-001
                      </code>
                      <Badge variant="secondary" className="text-xs">
                        Share this URL for instant verification
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  {downloadUrl && (
                    <Button
                      variant="hero"
                      onClick={() =>
                        window.open(`http://localhost:5000${downloadUrl}`, "_blank")
                      }
                    >
                      Download Certificate
                    </Button>
                  )}
                  <Button variant="outline">Share Verification Link</Button>
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    Issue Another
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
