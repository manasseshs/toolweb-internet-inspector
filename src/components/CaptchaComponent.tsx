
import React, { useState, useCallback, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CaptchaComponentProps {
  onVerify: (verified: boolean) => void;
  isRequired: boolean;
}

const CaptchaComponent: React.FC<CaptchaComponentProps> = ({ onVerify, isRequired }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Site key para desenvolvimento - em produção, deve usar uma chave real
  const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Chave de teste do Google

  useEffect(() => {
    // Preload the CAPTCHA more quickly
    if (isRequired) {
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isRequired]);

  const handleRecaptchaChange = useCallback((token: string | null) => {
    const verified = !!token;
    setIsVerified(verified);
    onVerify(verified);
  }, [onVerify]);

  const handleRecaptchaExpired = useCallback(() => {
    setIsVerified(false);
    onVerify(false);
  }, [onVerify]);

  if (!isRequired) {
    return null;
  }

  return (
    <Card className="border-[#dee2e6] bg-white shadow-sm max-w-[320px] mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-[#6c757d] flex items-center gap-2">
          🔒 Security Check
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        <div className="space-y-2">
          <div className="flex flex-col items-center gap-2">
            {isLoaded && (
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleRecaptchaChange}
                onExpired={handleRecaptchaExpired}
                theme="light"
                size="compact"
              />
            )}
            {!isLoaded && (
              <div className="w-[164px] h-[144px] bg-[#f8f9fa] border border-[#dee2e6] rounded flex items-center justify-center">
                <div className="text-xs text-[#6c757d]">Loading...</div>
              </div>
            )}
          </div>
          
          {isVerified && (
            <div className="text-[#28a745] text-xs font-medium flex items-center gap-1 justify-center">
              ✅ Verified
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CaptchaComponent;
