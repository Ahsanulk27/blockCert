import { Link } from "react-router-dom";
import { Shield, Github, Twitter, Linkedin, Mail } from "lucide-react";

const links = {
  platform: [
    { name: "Verify Certificate", href: "/verify" },
    { name: "Issue Certificate", href: "/issue" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "API Documentation", href: "/docs" }
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Technology", href: "/technology" },
    { name: "Security", href: "/security" },
    { name: "Contact", href: "/contact" }
  ],
  resources: [
    { name: "Help Center", href: "/help" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Status", href: "/status" }
  ]
};

const socialLinks = [
  { name: "GitHub", icon: Github, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Email", icon: Mail, href: "mailto:contact@blockcert.com" }
];

export function Footer() {
  return (
    <footer className="bg-card/50 border-t border-card-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-blockchain flex items-center justify-center">
                <Shield className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-xl font-bold">
                Block<span className="text-primary">Cert</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Revolutionary blockchain-based certificate issuance and verification platform. 
              Building trust in digital credentials through cryptographic security.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-9 h-9 rounded-lg bg-muted/50 hover:bg-primary/20 flex items-center justify-center group transition-all duration-300 hover:shadow-glow"
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Platform</h3>
            <ul className="space-y-3">
              {links.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Company</h3>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-card-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 BlockCert. All rights reserved. Built with blockchain technology.
            </div>
            <div className="text-sm text-muted-foreground">
              Secured by cryptographic hashing & distributed ledger technology
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-gradient-glow"></div>
    </footer>
  );
}