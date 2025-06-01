
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Database, MessageSquare } from 'lucide-react';
import VerifiedEmails from './VerifiedEmails';
import EmailMigration from './EmailMigration';
import SupportTickets from './SupportTickets';

const DashboardTabs: React.FC = () => {
  return (
    <Tabs defaultValue="email-verification" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border-gray-700">
        <TabsTrigger value="email-verification" className="data-[state=active]:bg-gray-700 text-gray-300">
          <CheckCircle className="w-4 h-4 mr-2" />
          Email Verification
        </TabsTrigger>
        <TabsTrigger value="email-migration" className="data-[state=active]:bg-gray-700 text-gray-300">
          <Database className="w-4 h-4 mr-2" />
          Email Migration
        </TabsTrigger>
        <TabsTrigger value="support" className="data-[state=active]:bg-gray-700 text-gray-300">
          <MessageSquare className="w-4 h-4 mr-2" />
          Support / Tickets
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="email-verification" className="mt-6">
        <VerifiedEmails />
      </TabsContent>
      
      <TabsContent value="email-migration" className="mt-6">
        <EmailMigration />
      </TabsContent>
      
      <TabsContent value="support" className="mt-6">
        <SupportTickets />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
