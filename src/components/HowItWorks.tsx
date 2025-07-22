import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Hash, Shield, CheckCircle2, ArrowRight, ArrowDown } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Certificate Created",
    description: "Institution creates and uploads certificate with student details and course information.",
    detail: "Digital certificate with embedded metadata"
  },
  {
    icon: Hash,
    title: "Cryptographic Hash",
    description: "Certificate data is processed through SHA-256 cryptographic hashing for unique fingerprint.",
    detail: "Immutable digital signature generated"
  },
  {
    icon: Shield,
    title: "Blockchain Storage",
    description: "Hash is permanently stored on the blockchain, creating an immutable record.",
    detail: "Distributed ledger ensures permanence"
  },
  {
    icon: CheckCircle2,
    title: "Instant Verification",
    description: "Anyone can verify certificate authenticity by comparing against blockchain records.",
    detail: "Real-time validation in seconds"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid opacity-20"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How <span className="text-glow">Blockchain</span> Ensures{" "}
            <span className="bg-gradient-cyber bg-clip-text text-transparent">Trust</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our revolutionary process combines cryptographic security with blockchain immutability 
            to create certificates that are impossible to forge or tamper with.
          </p>
        </div>
        
        {/* Interactive Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">
                {/* Connecting Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-20">
                    <ArrowRight className="w-6 h-6 text-primary/50 group-hover:text-primary transition-colors" />
                  </div>
                )}
                
                {/* Mobile Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                    <ArrowDown className="w-6 h-6 text-primary/50" />
                  </div>
                )}
                
                {/* Step Card */}
                <Card className="card-blockchain p-6 h-full hover-glow group-hover:border-primary/30 transition-all duration-500">
                  {/* Step Number */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-blockchain text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="text-xs text-primary/80 font-medium">
                    {step.detail}
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-blockchain opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-lg"></div>
                </Card>
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}