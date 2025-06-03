
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardNetwork from "./pages/DashboardNetwork";
import DashboardDNS from "./pages/DashboardDNS";
import DashboardEmail from "./pages/DashboardEmail";
import DashboardSecurity from "./pages/DashboardSecurity";
import DashboardMonitoring from "./pages/DashboardMonitoring";
import ToolPage from "./pages/ToolPage";
import Pricing from "./pages/Pricing";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/network" element={<DashboardNetwork />} />
              <Route path="/dashboard/dns" element={<DashboardDNS />} />
              <Route path="/dashboard/email" element={<DashboardEmail />} />
              <Route path="/dashboard/security" element={<DashboardSecurity />} />
              <Route path="/dashboard/monitoring" element={<DashboardMonitoring />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/admin" element={<Admin />} />
              
              {/* Individual Tool Routes */}
              <Route path="/tools/blacklist-check" element={<ToolPage />} />
              <Route path="/tools/ptr-lookup" element={<ToolPage />} />
              <Route path="/tools/arin-lookup" element={<ToolPage />} />
              <Route path="/tools/tcp-port-test" element={<ToolPage />} />
              <Route path="/tools/ping-test" element={<ToolPage />} />
              <Route path="/tools/traceroute" element={<ToolPage />} />
              <Route path="/tools/geoip-lookup" element={<ToolPage />} />
              <Route path="/tools/a-record" element={<ToolPage />} />
              <Route path="/tools/mx-record" element={<ToolPage />} />
              <Route path="/tools/spf-check" element={<ToolPage />} />
              <Route path="/tools/txt-records" element={<ToolPage />} />
              <Route path="/tools/cname-lookup" element={<ToolPage />} />
              <Route path="/tools/soa-record" element={<ToolPage />} />
              <Route path="/tools/dns-diagnostic" element={<ToolPage />} />
              <Route path="/tools/dnssec-check" element={<ToolPage />} />
              <Route path="/tools/https-test" element={<ToolPage />} />
              <Route path="/tools/whois-lookup" element={<ToolPage />} />
              <Route path="/tools/dns-propagation" element={<ToolPage />} />
              <Route path="/tools/smtp-test" element={<ToolPage />} />
              <Route path="/tools/email-validation" element={<ToolPage />} />
              <Route path="/tools/email-deliverability" element={<ToolPage />} />
              <Route path="/tools/spf-generator" element={<ToolPage />} />
              <Route path="/tools/header-analyzer" element={<ToolPage />} />
              <Route path="/tools/email-migration" element={<ToolPage />} />
              <Route path="/tools/header-security" element={<ToolPage />} />
              
              {/* Legacy tool routes - redirect to new format */}
              <Route path="/blacklist-check" element={<Index />} />
              <Route path="/ptr-lookup" element={<Index />} />
              <Route path="/arin-lookup" element={<Index />} />
              <Route path="/tcp-port-test" element={<Index />} />
              <Route path="/ping-test" element={<Index />} />
              <Route path="/traceroute" element={<Index />} />
              <Route path="/geoip-lookup" element={<Index />} />
              <Route path="/a-record" element={<Index />} />
              <Route path="/mx-record" element={<Index />} />
              <Route path="/spf-check" element={<Index />} />
              <Route path="/txt-records" element={<Index />} />
              <Route path="/cname-lookup" element={<Index />} />
              <Route path="/soa-record" element={<Index />} />
              <Route path="/dns-diagnostic" element={<Index />} />
              <Route path="/dnssec-check" element={<Index />} />
              <Route path="/https-test" element={<Index />} />
              <Route path="/whois-lookup" element={<Index />} />
              <Route path="/dns-propagation" element={<Index />} />
              <Route path="/smtp-test" element={<Index />} />
              <Route path="/email-validation" element={<Index />} />
              <Route path="/email-deliverability" element={<Index />} />
              <Route path="/spf-generator" element={<Index />} />
              <Route path="/header-analyzer" element={<Index />} />
              <Route path="/email-migration" element={<Index />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
