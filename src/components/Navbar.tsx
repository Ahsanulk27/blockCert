import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Verify", href: "/verify" },
  { name: "Issue", href: "/issue" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-card-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
           
            <span className="text-xl font-bold">
              Block<span className="text-primary">Cert</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-all duration-300 hover:text-primary relative group",
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.name}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                    isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="hero" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-md border-b border-card-border">
          <div className="px-6 py-4 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 space-y-2">
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="hero" size="sm" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
