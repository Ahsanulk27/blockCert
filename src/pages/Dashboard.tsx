import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Calendar,
  Users,
  TrendingUp 
} from "lucide-react";

const certificates = [
  {
    id: "CERT-2024-001",
    studentName: "Alice Johnson",
    course: "Advanced Blockchain Development",
    dateIssued: "2024-03-15",
    status: "verified",
    hash: "0x7d4a8b...9f2e1c"
  },
  {
    id: "CERT-2024-002", 
    studentName: "Bob Smith",
    course: "Cryptography Fundamentals",
    dateIssued: "2024-03-14",
    status: "verified",
    hash: "0x9f2e1c...7d4a8b"
  },
  {
    id: "CERT-2024-003",
    studentName: "Carol Davis",
    course: "Smart Contract Security",
    dateIssued: "2024-03-13",
    status: "pending",
    hash: "0x1c7d4a...2e9f8b"
  },
  {
    id: "CERT-2024-004",
    studentName: "David Wilson",
    course: "DeFi Protocols",
    dateIssued: "2024-03-12",
    status: "verified",
    hash: "0x8b9f2e...4a7d1c"
  }
];

const stats = [
  {
    label: "Total Issued",
    value: "1,247",
    change: "+12%",
    icon: FileText,
    color: "text-primary"
  },
  {
    label: "This Month",
    value: "89",
    change: "+23%", 
    icon: Calendar,
    color: "text-secondary"
  },
  {
    label: "Active Students",
    value: "856",
    change: "+8%",
    icon: Users,
    color: "text-accent"
  },
  {
    label: "Verification Rate",
    value: "99.7%",
    change: "+0.2%",
    icon: TrendingUp,
    color: "text-success"
  }
];

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || cert.status === filterStatus;
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="card-blockchain p-6 hover-glow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-xs ${stat.color} font-medium`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
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
                  <option value="pending">Pending</option>
                </select>
                
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/20">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Certificate ID</th>
                  <th className="text-left p-4 font-medium text-sm">Student</th>
                  <th className="text-left p-4 font-medium text-sm">Course</th>
                  <th className="text-left p-4 font-medium text-sm">Date Issued</th>
                  <th className="text-left p-4 font-medium text-sm">Status</th>
                  <th className="text-left p-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.map((cert, index) => (
                  <tr key={cert.id} className="border-b border-card-border hover:bg-muted/10 transition-colors">
                    <td className="p-4">
                      <div className="font-mono text-sm text-primary">{cert.id}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {cert.hash}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{cert.studentName}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{cert.course}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{cert.dateIssued}</div>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={cert.status === "verified" ? "secondary" : "destructive"}
                        className="gap-1"
                      >
                        {cert.status === "verified" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {cert.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredCertificates.length === 0 && (
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