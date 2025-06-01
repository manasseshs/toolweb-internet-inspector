
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
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/admin" element={<Admin />} />
              {/* Tool routes - all render within Index layout */}
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
