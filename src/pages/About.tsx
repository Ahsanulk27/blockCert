import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { 
  Shield, 
  Hash, 
  Lock, 
  Globe, 
  Zap, 
  CheckCircle2,
  ArrowRight,
  Code,
  GraduationCap,
  Building
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Immutable Security",
    description: "Certificates are cryptographically secured and stored on blockchain, making them impossible to forge or tamper with.",
    color: "text-primary"
  },
  {
    icon: Zap,
    title: "Instant Verification",
    description: "Verify any certificate in seconds through our blockchain network, providing real-time authenticity confirmation.",
    color: "text-secondary"
  },
  {
    icon: Globe,
    title: "Global Accessibility",
    description: "Access and verify certificates from anywhere in the world, 24/7, without relying on centralized authorities.",
    color: "text-accent"
  },
  {
    icon: Lock,
    title: "Privacy Protected",
    description: "Student data remains private while maintaining public verifiability of certificate authenticity.",
    color: "text-success"
  }
];

const process = [
  {
    step: 1,
    title: "Document Processing",
    description: "Certificate data is extracted and standardized into a structured format with all relevant metadata.",
    technical: "JSON schema validation • Metadata extraction • Format standardization"
  },
  {
    step: 2,
    title: "Cryptographic Hashing",
    description: "SHA-256 algorithm creates a unique digital fingerprint that represents the certificate's exact content.",
    technical: "SHA-256 hashing • Salt generation • Merkle tree construction"
  },
  {
    step: 3,
    title: "Blockchain Transaction",
    description: "The hash is submitted to the blockchain network in a transaction that creates an immutable record.",
    technical: "Smart contract execution • Gas optimization • Transaction confirmation"
  },
  {
    step: 4,
    title: "Distributed Storage",
    description: "The record is distributed across thousands of blockchain nodes, ensuring permanent availability.",
    technical: "Consensus mechanism • Block validation • Network propagation"
  }
];

const useCases = [
  {
    icon: GraduationCap,
    title: "Educational Institutions",
    description: "Universities, colleges, and schools can issue tamper-proof diplomas, certificates, and transcripts.",
    benefits: ["Prevent diploma mills", "Reduce verification costs", "Enhance institutional reputation"]
  },
  {
    icon: Building,
    title: "Professional Certification",
    description: "Industry bodies and training organizations can certify professional qualifications and skills.",
    benefits: ["Combat credential fraud", "Streamline HR processes", "Enable global recognition"]
  },
  {
    icon: Code,
    title: "Technical Credentials",
    description: "Coding bootcamps, online courses, and tech certifications with verifiable authenticity.",
    benefits: ["Validate online learning", "Support remote education", "Build employer trust"]
  }
];

export default function About() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            The <span className="text-glow">Technology</span> Behind{" "}
            <span className="bg-gradient-cyber bg-clip-text text-transparent">Trust</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our blockchain-powered certificate platform combines cutting-edge cryptography 
            with distributed ledger technology to create the most secure and transparent 
            credentialing system in the world.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="card-blockchain p-8 hover-glow group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Technical Process */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-cyber-glow">Cryptographic</span> Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Deep dive into the technical architecture that makes our certificates 
              mathematically impossible to forge.
            </p>
          </div>

          <div className="space-y-8">
            {process.map((step, index) => (
              <Card key={index} className="card-blockchain p-8 hover-glow">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-blockchain flex items-center justify-center text-lg font-bold">
                      {step.step}
                    </div>
                    <div className="lg:w-64">
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-muted/20 rounded-lg p-4">
                    <h4 className="font-medium text-sm mb-2 text-primary">Technical Implementation</h4>
                    <p className="text-xs text-muted-foreground font-mono">
                      {step.technical}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real-World <span className="text-glow">Applications</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From universities to tech bootcamps, see how institutions are leveraging 
              blockchain technology to combat credential fraud.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <Card key={index} className="card-blockchain p-6 hover-glow group">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                    <Icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 group-hover:text-secondary transition-colors">
                    {useCase.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {useCase.description}
                  </p>
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
    </>
  );
}