
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send } from 'lucide-react';

interface Message {
  id: string;
  message: string;
  is_admin_reply: boolean;
  created_at: string;
}

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

interface MessageThreadProps {
  ticket: Ticket | null;
  messages: Message[];
  newMessage: string;
  onNewMessageChange: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => Promise<void>;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  ticket,
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage
}) => {
  if (!ticket) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          {ticket.subject}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="max-h-96 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg ${
                  message.is_admin_reply
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : 'bg-gray-50 border-l-4 border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {message.is_admin_reply ? 'Support Team' : 'You'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm">{message.message}</p>
              </div>
            ))}
          </div>

          {ticket.status !== 'closed' && (
            <form onSubmit={onSendMessage} className="space-y-3">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => onNewMessageChange(e.target.value)}
                className="min-h-[80px]"
              />
              <Button type="submit" disabled={!newMessage.trim()}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          )}

          {ticket.status === 'closed' && (
            <p className="text-center text-gray-500 py-4">
              This ticket has been closed. Create a new ticket if you need further assistance.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageThread;
