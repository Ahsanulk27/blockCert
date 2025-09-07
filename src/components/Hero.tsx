import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import heroImage from "@/assets/hero-blockchain.jpg";

export function Hero() {
  const { isAuthenticated } = useAuth();

  const handleIssueClick = () => {
    if (!isAuthenticated) {
      // Redirect to login for non-authenticated users
      window.location.href = "/login";
    } else {
      // Redirect to issue page for authenticated users
      window.location.href = "/issue";
    }
  };

  const handleVerifyClick = () => {
    // Verify is always accessible
    window.location.href = "/verify";
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <img
          src={heroImage}
          alt="Blockchain Technology"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-float"></div>
      <div
        className="absolute top-40 right-20 w-6 h-6 bg-secondary rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-32 left-20 w-3 h-3 bg-accent rounded-full animate-float"
        style={{ animationDelay: "4s" }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-card/20 backdrop-blur-md border border-card-border rounded-full text-sm text-muted-foreground animate-fade-in">
          <Zap className="w-4 h-4 text-primary" />
          Blockchain-Powered Certificate Platform
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
          <span className="text-glow">Tamper-Proof.</span>
          <br />
          <span className="text-cyber-glow">Trustable.</span>
          <br />
          <span className="bg-gradient-blockchain bg-clip-text text-transparent">
            Blockchain-Certified.
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          Revolutionary certificate issuance and verification powered by
          blockchain technology. Ensure authenticity, prevent fraud, and build
          trust in digital credentials.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in"
          style={{ animationDelay: "0.6s" }}
        >
          <Button
            variant="hero"
            size="xl"
            className="group"
            onClick={handleVerifyClick}
          >
            <Shield className="w-5 h-5 mr-2" />
            Verify Certificate
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="cyber"
            size="xl"
            className="group"
            onClick={handleIssueClick}
          >
            Issue Certificate
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-fade-in"
          style={{ animationDelay: "0.9s" }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-primary text-glow mb-2">
              100%
            </div>
            <div className="text-muted-foreground">Tamper-Proof</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary text-cyber-glow mb-2">
              0.3s
            </div>
            <div className="text-muted-foreground">Verification Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">24/7</div>
            <div className="text-muted-foreground">Global Access</div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
