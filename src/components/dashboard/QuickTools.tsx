
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const QuickTools: React.FC = () => {
  const navigate = useNavigate();

  const tools = [
    { name: 'Blacklist Check', path: '/tools/blacklist' },
    { name: 'MX Lookup', path: '/tools/mx' },
    { name: 'Ping Test', path: '/tools/ping' },
    { name: 'WHOIS', path: '/tools/whois' }
  ];

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Quick Tools</CardTitle>
        <CardDescription className="text-gray-400">
          Access your favorite tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tools.map((tool) => (
            <Button
              key={tool.name}
              variant="ghost"
              onClick={() => navigate(tool.path)}
              className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              {tool.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickTools;
