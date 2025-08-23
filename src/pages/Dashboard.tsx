import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import {
  Search,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import axios from "axios";
import { getAuthHeaders } from "@/api/auth";
import { useAuth } from "@/components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        setError(null);
        const headers = getAuthHeaders();
        const res = await axios.get("http://localhost:5000/api/certificates", {
          headers,
        });
        setCertificates(res.data);
      } catch (error: any) {
        console.error("Error fetching certificates", error);
        if (
          error.message === "No authentication token found" ||
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          // Token is invalid or expired, redirect to login
          logout();
        } else {
          setError("Failed to fetch certificates. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCertificates();
    }
  }, [isAuthenticated, logout]);

  const handleRevoke = async (id: string) => {
    try {
      const headers = getAuthHeaders();
      await axios.patch(
        `http://localhost:5000/api/certificates/${id}/revoke`,
        {},
        { headers }
      );

      // Update UI optimistically
      setCertificates((prev) =>
        prev.map((cert) => (cert.id === id ? { ...cert, revoked: true } : cert))
      );
    } catch (error: any) {
      console.error("Error revoking certificate", error);
      if (
        error.message === "No authentication token found" ||
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        logout();
      }
    }
  };

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.id.toLowerCase().includes(searchTerm.toLowerCase());

    // derive status based on revoked flag
    const status = cert.revoked ? "revoked" : "verified";
    const matchesFilter = filterStatus === "all" || filterStatus === status;

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Institution <span className="text-glow">Dashboard</span>
              </h1>
              <p className="text-muted-foreground">
                Manage and monitor your issued certificates
              </p>
            </div>
            <Button variant="hero" size="lg">
              <FileText className="w-5 h-5 mr-2" />
              Issue New Certificate
            </Button>
          </div>

          {/* Certificates Table */}
          <Card className="card-blockchain overflow-hidden">
            {/* Table Header */}
            <div className="p-6 border-b border-card-border">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <h2 className="text-xl font-semibold">Issued Certificates</h2>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search certificates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-card border border-card-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="all">All Status</option>
                    <option value="verified">Verified</option>
                    <option value="revoked">Revoked</option>
                  </select>

                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading certificates...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h3 className="font-medium mb-2 text-destructive">
                  Error loading certificates
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Table Content */}
            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/20">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">
                        Certificate ID
                      </th>
                      <th className="text-left p-4 font-medium text-sm">
                        Student
                      </th>
                      <th className="text-left p-4 font-medium text-sm">
                        Course
                      </th>
                      <th className="text-left p-4 font-medium text-sm">
                        Date Issued
                      </th>
                      <th className="text-left p-4 font-medium text-sm">
                        Status
                      </th>
                      <th className="text-left p-4 font-medium text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCertificates.map((cert) => {
                      const status = cert.revoked ? "revoked" : "verified";

                      return (
                        <tr
                          key={cert.id}
                          className="border-b border-card-border hover:bg-muted/10 transition-colors"
                        >
                          <td className="p-4">
                            <div className="font-mono text-sm text-primary">
                              {cert.id}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {cert.blockchainHash}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">
                              {cert.studentName}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">{cert.course}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              {new Date(cert.dateIssued).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={
                                status === "verified"
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="gap-1"
                            >
                              {status === "verified" ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <AlertTriangle className="w-3 h-3" />
                              )}
                              {status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            {!cert.revoked && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRevoke(cert.id)}
                              >
                                Revoke
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State */}
            {filteredCertificates.length === 0 && !loading && !error && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No certificates found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
