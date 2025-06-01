
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import NewTicketForm from './support/NewTicketForm';
import TicketList from './support/TicketList';
import MessageThread from './support/MessageThread';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  message: string;
  is_admin_reply: boolean;
  created_at: string;
}

const SupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicketData, setNewTicketData] = useState({
    subject: '',
    category: '',
    priority: 'normal',
    message: ''
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTickets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('support_ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Create ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject: newTicketData.subject,
          category: newTicketData.category,
          priority: newTicketData.priority
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      // Create initial message
      const { error: messageError } = await supabase
        .from('support_ticket_messages')
        .insert({
          ticket_id: ticketData.id,
          user_id: user.id,
          message: newTicketData.message,
          is_admin_reply: false
        });

      if (messageError) throw messageError;

      toast({
        title: "Ticket created",
        description: "Your support ticket has been created successfully.",
      });

      setNewTicketData({ subject: '', category: '', priority: 'normal', message: '' });
      setShowNewTicket(false);
      fetchTickets();
    } catch (error: any) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create ticket.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessage.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('support_ticket_messages')
        .insert({
          ticket_id: selectedTicket,
          user_id: user.id,
          message: newMessage.trim(),
          is_admin_reply: false
        });

      if (error) throw error;

      setNewMessage('');
      fetchMessages(selectedTicket);
      
      // Update ticket status to 'open' if it was 'replied'
      await supabase
        .from('support_tickets')
        .update({ status: 'open', updated_at: new Date().toISOString() })
        .eq('id', selectedTicket);

      fetchTickets();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setNewTicketData(prev => ({ ...prev, [field]: value }));
  };

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicket(ticketId);
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket);
    }
  }, [selectedTicket]);

  const selectedTicketData = tickets.find(t => t.id === selectedTicket);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Support Tickets</h2>
        <Button onClick={() => setShowNewTicket(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      <NewTicketForm
        isVisible={showNewTicket}
        onCancel={() => setShowNewTicket(false)}
        onSubmit={createTicket}
        formData={newTicketData}
        onFormChange={handleFormChange}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <TicketList
          tickets={tickets}
          selectedTicketId={selectedTicket}
          onTicketSelect={handleTicketSelect}
        />

        <MessageThread
          ticket={selectedTicketData || null}
          messages={messages}
          newMessage={newMessage}
          onNewMessageChange={setNewMessage}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default SupportTickets;
