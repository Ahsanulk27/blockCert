import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {Navbar} from "@/components/Navbar";
import { registerIssuer } from "@/api/auth";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
  
    if (!name || !email || !password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }
  
    try {
      const data = await registerIssuer({ name, email, password });
  
      localStorage.setItem("token", data.token);
  
      setSuccess(true);
      console.log("Registered issuer:", data);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-card">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-glow bg-card border border-card-border">
        <h2 className="text-3xl font-bold mb-2 text-center">Sign Up</h2>
        <p className="text-muted-foreground mb-6 text-center">
          Create your institution account
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-card-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
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
            <div className="text-destructive text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-success text-sm text-center">
              Account created! You can now{" "}
              <Link to="/login" className="underline text-primary">
                login
              </Link>
              .
            </div>
          )}
          <Button
            type="submit"
            variant="hero"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
