
import React, { useState, useCallback } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CaptchaComponentProps {
  onVerify: (verified: boolean) => void;
  isRequired: boolean;
}

const CaptchaComponent: React.FC<CaptchaComponentProps> = ({ onVerify, isRequired }) => {
  const [isVerified, setIsVerified] = useState(false);

  // Site key para desenvolvimento - em produção, deve usar uma chave real
  const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Chave de teste do Google

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
    <Card className="border-[#dee2e6] bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[#495057] flex items-center gap-2">
          🔒 Security Verification Required
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="space-y-2">
          <div className="flex flex-col items-center gap-2">
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleRecaptchaChange}
              onExpired={handleRecaptchaExpired}
              theme="light"
              size="normal"
            />
          </div>
          
          {isVerified && (
            <div className="text-[#28a745] text-sm font-medium flex items-center gap-2 justify-center">
              ✅ Verified! You can now proceed.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CaptchaComponent;
