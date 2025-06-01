
import React from 'react';
import { Network } from 'lucide-react';

interface FooterSectionProps {
  onToolSelect: (toolId: string) => void;
}

const FooterSection: React.FC<FooterSectionProps> = ({ onToolSelect }) => {
  return (
    <footer className="bg-white border-t border-[#dee2e6] mt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#0d6efd] to-[#6f42c1] rounded-lg flex items-center justify-center">
                <Network className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#212529]">ToolWeb.io</h3>
            </div>
            <p className="text-[#6c757d] text-sm">The essential toolkit for domains, IP addresses, and network diagnostics.</p>
          </div>
          <div>
            <h4 className="text-[#212529] font-semibold mb-3 text-sm">Popular Tools</h4>
            <ul className="space-y-2 text-sm text-[#6c757d]">
              <li><button onClick={() => onToolSelect('blacklist')} className="hover:text-[#0d6efd] transition-colors">Blacklist Check</button></li>
              <li><button onClick={() => onToolSelect('mx')} className="hover:text-[#0d6efd] transition-colors">MX Lookup</button></li>
              <li><button onClick={() => onToolSelect('ping')} className="hover:text-[#0d6efd] transition-colors">Ping Test</button></li>
              <li><button onClick={() => onToolSelect('whois')} className="hover:text-[#0d6efd] transition-colors">WHOIS</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#212529] font-semibold mb-3 text-sm">Account</h4>
            <ul className="space-y-2 text-sm text-[#6c757d]">
              <li><a href="/login" className="hover:text-[#0d6efd] transition-colors">Login</a></li>
              <li><a href="/register" className="hover:text-[#0d6efd] transition-colors">Register</a></li>
              <li><a href="/pricing" className="hover:text-[#0d6efd] transition-colors">Pricing</a></li>
              <li><a href="/dashboard" className="hover:text-[#0d6efd] transition-colors">Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#212529] font-semibold mb-3 text-sm">Support</h4>
            <ul className="space-y-2 text-sm text-[#6c757d]">
              <li><a href="/contact" className="hover:text-[#0d6efd] transition-colors">Contact Us</a></li>
              <li><a href="/help" className="hover:text-[#0d6efd] transition-colors">Help Center</a></li>
              <li><a href="/privacy" className="hover:text-[#0d6efd] transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-[#0d6efd] transition-colors">Terms of Use</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#dee2e6] mt-6 pt-6 text-center text-[#6c757d] text-sm">
          <p>&copy; 2024 ToolWeb.io. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
