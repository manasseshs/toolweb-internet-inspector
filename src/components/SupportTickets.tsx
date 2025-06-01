
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const categories = [
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing & Account' },
    { value: 'feature_request', label: 'Feature Request' },
    { value: 'bug_report', label: 'Bug Report' },
    { value: 'general', label: 'General Inquiry' }
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

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

  useEffect(() => {
    fetchTickets();
  }, [user]);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket);
    }
  }, [selectedTicket]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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

      {showNewTicket && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createTicket} className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={newTicketData.subject}
                  onChange={(e) => setNewTicketData(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newTicketData.category}
                    onValueChange={(value) => setNewTicketData(prev => ({ ...prev, category: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTicketData.priority}
                    onValueChange={(value) => setNewTicketData(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((pri) => (
                        <SelectItem key={pri.value} value={pri.value}>
                          {pri.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue in detail..."
                  value={newTicketData.message}
                  onChange={(e) => setNewTicketData(prev => ({ ...prev, message: e.target.value }))}
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Create Ticket</Button>
                <Button type="button" variant="outline" onClick={() => setShowNewTicket(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tickets found. Create your first ticket above.</p>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTicket === ticket.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTicket(ticket.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{ticket.subject}</h4>
                      <div className="flex gap-1">
                        <Badge className={getStatusColor(ticket.status)} size="sm">
                          {ticket.status}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)} size="sm">
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {categories.find(c => c.value === ticket.category)?.label} •{' '}
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Messages */}
        {selectedTicketData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {selectedTicketData.subject}
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

                {selectedTicketData.status !== 'closed' && (
                  <form onSubmit={sendMessage} className="space-y-3">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <Button type="submit" disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}

                {selectedTicketData.status === 'closed' && (
                  <p className="text-center text-gray-500 py-4">
                    This ticket has been closed. Create a new ticket if you need further assistance.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SupportTickets;
