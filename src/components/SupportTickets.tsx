import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
  status: string;
  created_at: string;
  user_id: string;
}

const SupportTickets: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('normal');
  const [description, setDescription] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tickets:', error);
        toast({
          title: "Error",
          description: "Failed to load support tickets.",
          variant: "destructive",
        });
      } else {
        setTickets(data || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createTicket = async () => {
    if (!user || !subject || !description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert([
          {
            subject,
            category,
            priority,
            description,
            user_id: user.id,
            status: 'open',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating ticket:', error);
        toast({
          title: "Error",
          description: "Failed to create support ticket.",
          variant: "destructive",
        });
      } else {
        setTickets([data, ...tickets]);
        setSubject('');
        setDescription('');
        setCategory('general');
        setPriority('normal');
        toast({
          title: "Success",
          description: "Support ticket created successfully.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Support Ticket</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="billing">Billing Issue</SelectItem>
                <SelectItem value="technical">Technical Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button onClick={createTicket} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Ticket'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedTicket(ticket)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{ticket.subject}</h4>
                      <p className="text-sm text-gray-600">Category: {ticket.category}</p>
                      <p className="text-xs text-gray-500">Created: {new Date(ticket.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={ticket.status === 'open' ? 'bg-green-100 text-green-800' : 
                                 ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                                 'bg-gray-100 text-gray-800'}
                      >
                        {ticket.status}
                      </Badge>
                      <Badge 
                        className={ticket.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                 ticket.priority === 'normal' ? 'bg-blue-100 text-blue-800' : 
                                 'bg-gray-100 text-gray-800'}
                      >
                        {ticket.priority}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedTicket && (
        <Card>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Subject</h4>
              <p>{selectedTicket.subject}</p>
            </div>
            <div>
              <h4 className="font-medium">Category</h4>
              <p>{selectedTicket.category}</p>
            </div>
            <div>
              <h4 className="font-medium">Priority</h4>
              <p>{selectedTicket.priority}</p>
            </div>
            <div>
              <h4 className="font-medium">Description</h4>
              <p>{selectedTicket.description}</p>
            </div>
            <div>
              <h4 className="font-medium">Status</h4>
              <p>{selectedTicket.status}</p>
            </div>
            <div>
              <h4 className="font-medium">Created At</h4>
              <p>{new Date(selectedTicket.created_at).toLocaleDateString()}</p>
            </div>
            <Button onClick={() => setSelectedTicket(null)}>Close</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SupportTickets;
