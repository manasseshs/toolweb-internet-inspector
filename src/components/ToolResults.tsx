
import React from 'react';
import { Copy, Download, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ToolResultsProps {
  result: string;
  input: string;
  toolId: string;
  isLegacyTool?: boolean;
}

const ToolResults: React.FC<ToolResultsProps> = ({ 
  result, 
  input, 
  toolId, 
  isLegacyTool = false 
}) => {
  const { toast } = useToast();

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied",
      description: "Result copied to clipboard.",
    });
  };

  const downloadResult = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${toolId}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Result saved to file.",
    });
  };

  if (!result) return null;

  const cardClasses = isLegacyTool 
    ? "bg-gray-800/50 border-gray-700"
    : "border-[#c3e6cb] bg-[#d4edda]";
    
  const titleClasses = isLegacyTool 
    ? "text-white"
    : "text-[#155724] flex items-center gap-2";
    
  const buttonClasses = isLegacyTool
    ? "border-gray-600 text-gray-300 hover:bg-gray-800"
    : "border-[#c3e6cb] text-[#155724] hover:bg-[#c3e6cb]";
    
  const textareaClasses = isLegacyTool
    ? "bg-gray-900 border-gray-600 text-gray-300 font-mono text-sm min-h-[300px] resize-none"
    : "bg-white border-[#c3e6cb] text-[#212529] font-mono text-sm min-h-[300px] resize-none";

  return (
    <Card className={cardClasses}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={titleClasses}>
              {!isLegacyTool && <CheckCircle className="w-5 h-5" />}
              Results
            </CardTitle>
            <CardDescription className={isLegacyTool ? "text-gray-400" : "text-[#155724]"}>
              Analysis output for {input}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyResult} className={buttonClasses}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={downloadResult} className={buttonClasses}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={result}
          readOnly
          className={textareaClasses}
        />
      </CardContent>
    </Card>
  );
};

export default ToolResults;
