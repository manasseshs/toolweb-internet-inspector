
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw } from 'lucide-react';

interface CaptchaComponentProps {
  onVerify: (verified: boolean) => void;
  isRequired: boolean;
}

const CaptchaComponent: React.FC<CaptchaComponentProps> = ({ onVerify, isRequired }) => {
  const [captchaQuestion, setCaptchaQuestion] = useState({ question: '', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let answer = 0;
    let question = '';
    
    switch (operation) {
      case '+':
        answer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
        break;
      case '-':
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        answer = larger - smaller;
        question = `${larger} - ${smaller} = ?`;
        break;
      case '*':
        answer = num1 * num2;
        question = `${num1} × ${num2} = ?`;
        break;
    }
    
    setCaptchaQuestion({ question, answer });
    setUserAnswer('');
    setIsVerified(false);
    onVerify(false);
  };

  useEffect(() => {
    if (isRequired) {
      generateCaptcha();
    } else {
      setIsVerified(true);
      onVerify(true);
    }
  }, [isRequired]);

  const handleVerify = () => {
    const verified = parseInt(userAnswer) === captchaQuestion.answer;
    setIsVerified(verified);
    onVerify(verified);
    
    if (!verified) {
      generateCaptcha();
    }
  };

  if (!isRequired) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-amber-800 flex items-center gap-2">
          🔒 Security Verification Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-lg font-mono bg-white px-4 py-3 rounded-lg border border-amber-200 shadow-sm">
              {captchaQuestion.question}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateCaptcha}
              className="px-3 border-amber-300 hover:bg-amber-50"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Your answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-32 border-amber-200 focus:border-amber-400"
              onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
            />
            <Button 
              onClick={handleVerify}
              disabled={!userAnswer}
              className="bg-amber-500 hover:bg-amber-600 text-white shadow-md"
            >
              Verify
            </Button>
          </div>
          
          {isVerified && (
            <div className="text-green-600 text-sm font-medium flex items-center gap-2">
              ✅ Verified! You can now proceed.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CaptchaComponent;
