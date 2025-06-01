
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
    <Card className="border-gray-200 bg-white shadow-sm max-w-[320px] mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
          🔒 Security Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="space-y-3">
          <div className="flex flex-col items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-100">
            {isLoaded && (
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleRecaptchaChange}
                onExpired={handleRecaptchaExpired}
                theme="light"
                size="normal"
              />
            )}
            {!isLoaded && (
              <div className="w-[304px] h-[78px] bg-white border border-gray-300 rounded flex items-center justify-center">
                <div className="text-sm text-gray-500">Loading security check...</div>
              </div>
            )}
          </div>
          
          {isVerified && (
            <div className="text-green-600 text-sm font-medium flex items-center gap-2 justify-center bg-green-50 rounded-lg p-2">
              ✅ Verification successful
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CaptchaComponent;
