import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Upload, Search, CheckCircle2, XCircle, FileText, Hash, Clock } from "lucide-react";

export default function Verify() {
  const [dragActive, setDragActive] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'verified' | 'tampered' | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleVerification();
    }
  };

  const handleVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult(Math.random() > 0.3 ? 'verified' : 'tampered');
    }, 2000);
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
            Upload your certificate or enter its hash to instantly verify authenticity 
            against our blockchain records.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="card-blockchain p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Upload className="w-6 h-6 text-primary" />
              Upload Certificate
            </h2>
            
            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-primary bg-primary/5 shadow-glow' 
                  : 'border-card-border hover:border-primary/50'
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
                    Supports PDF, DOC, DOCX files up to 10MB
                  </p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleVerification}
              variant="hero" 
              size="lg" 
              className="w-full mt-6"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Verify Certificate
                </>
              )}
            </Button>
          </Card>

          {/* Hash Verification */}
          <Card className="card-blockchain p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Hash className="w-6 h-6 text-secondary" />
              Verify by Hash
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Certificate Hash
                </label>
                <Input
                  placeholder="Enter SHA-256 hash..."
                  className="font-mono text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Certificate ID (Optional)
                </label>
                <Input
                  placeholder="Enter certificate ID..."
                />
              </div>
              
              <Button variant="cyber" size="lg" className="w-full">
                <Search className="w-5 h-5 mr-2" />
                Search Blockchain
              </Button>
            </div>

            {/* Quick Search */}
            <div className="mt-8 pt-6 border-t border-card-border">
              <h3 className="font-medium mb-3">Quick Search</h3>
              <div className="space-y-2">
                <Input placeholder="Student name..." className="h-9" />
                <Input placeholder="Institution..." className="h-9" />
                <Button variant="ghost" size="sm" className="w-full">
                  Search Public Records
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <Card className={`card-blockchain p-8 mt-8 animate-scale-in ${
            verificationResult === 'verified' 
              ? 'border-success/30 bg-success/5' 
              : 'border-destructive/30 bg-destructive/5'
          }`}>
            <div className="text-center">
              {verificationResult === 'verified' ? (
                <>
                  <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-success mb-2">
                    Certificate Verified ✓
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    This certificate is authentic and has not been tampered with.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-card p-4 rounded-lg">
                      <div className="font-medium">Blockchain Hash</div>
                      <div className="font-mono text-xs text-primary break-all">
                        0x7d4a8b...9f2e1c
                      </div>
                    </div>
                    <div className="bg-card p-4 rounded-lg">
                      <div className="font-medium">Issued Date</div>
                      <div className="text-muted-foreground">
                        March 15, 2024
                      </div>
                    </div>
                    <div className="bg-card p-4 rounded-lg">
                      <div className="font-medium">Institution</div>
                      <div className="text-muted-foreground">
                        MIT OpenCourseWare
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
                    This certificate has been tampered with or is not in our blockchain records.
                  </p>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="text-sm text-destructive">
                      ⚠️ Warning: This certificate cannot be trusted. Contact the issuing institution for verification.
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