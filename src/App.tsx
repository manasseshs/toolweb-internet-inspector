
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import Tools from "./pages/Tools";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
            
            {/* Tool Routes */}
            <Route path="/blacklist-check" element={<Tools />} />
            <Route path="/ptr-lookup" element={<Tools />} />
            <Route path="/arin-lookup" element={<Tools />} />
            <Route path="/tcp-port-test" element={<Tools />} />
            <Route path="/ping-test" element={<Tools />} />
            <Route path="/traceroute" element={<Tools />} />
            <Route path="/geoip-lookup" element={<Tools />} />
            <Route path="/a-record" element={<Tools />} />
            <Route path="/mx-record" element={<Tools />} />
            <Route path="/spf-check" element={<Tools />} />
            <Route path="/txt-records" element={<Tools />} />
            <Route path="/cname-lookup" element={<Tools />} />
            <Route path="/soa-record" element={<Tools />} />
            <Route path="/dns-diagnostic" element={<Tools />} />
            <Route path="/dnssec-check" element={<Tools />} />
            <Route path="/https-test" element={<Tools />} />
            <Route path="/whois-lookup" element={<Tools />} />
            <Route path="/dns-propagation" element={<Tools />} />
            <Route path="/smtp-test" element={<Tools />} />
            <Route path="/email-validation" element={<Tools />} />
            <Route path="/email-deliverability" element={<Tools />} />
            <Route path="/spf-generator" element={<Tools />} />
            <Route path="/header-analyzer" element={<Tools />} />
            <Route path="/email-migration" element={<Tools />} />
            
            {/* Legacy tool route for backwards compatibility */}
            <Route path="/tools/:toolId" element={<Tools />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
