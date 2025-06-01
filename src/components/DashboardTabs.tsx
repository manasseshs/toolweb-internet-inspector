
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Database, MessageSquare, Settings } from 'lucide-react';
import VerifiedEmails from './VerifiedEmails';
import EmailMigration from './EmailMigration';
import SupportTickets from './SupportTickets';
import SubscriptionManager from './SubscriptionManager';

const DashboardTabs: React.FC = () => {
  return (
    <Tabs defaultValue="verified-emails" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="verified-emails" className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Verified Emails
        </TabsTrigger>
        <TabsTrigger value="migrations" className="flex items-center gap-2">
          <Database className="w-4 h-4" />
          Migrations
        </TabsTrigger>
        <TabsTrigger value="support" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Support
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="verified-emails" className="mt-6">
        <VerifiedEmails />
      </TabsContent>
      
      <TabsContent value="migrations" className="mt-6">
        <EmailMigration />
      </TabsContent>
      
      <TabsContent value="support" className="mt-6">
        <SupportTickets />
      </TabsContent>
      
      <TabsContent value="settings" className="mt-6">
        <SubscriptionManager />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
