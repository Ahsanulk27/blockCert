import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { loginIssuer

 } from "@/api/auth";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const data = await loginIssuer({ email, password });

      // Store token in localStorage 
      localStorage.setItem("token", data.token);

      // Optional: store issuer info
      // localStorage.setItem("issuer", JSON.stringify(data.issuer));

      console.log("Login successful:", data);
      window.location.href = "/"; 
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-card">
        <div className="w-full max-w-md p-8 rounded-2xl shadow-glow bg-card border border-card-border">
          <h2 className="text-3xl font-bold mb-2 text-center">Sign In</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Access your institution dashboard
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 rounded-lg border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 rounded-lg border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-destructive text-sm text-center">
                {error}
              </div>
            )}
            <Button
              type="submit"
              variant="hero"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
