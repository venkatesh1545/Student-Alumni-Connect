
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface SendMessageProps {
  receiverId: string;
  receiverName: string;
}

export const SendMessage = ({ receiverId, receiverName }: SendMessageProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (!user || !message.trim()) return;

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content: message.trim()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Message sent successfully!');
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send message');
    }
  });

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Send message to {receiverName}</h3>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        rows={4}
      />
      <Button
        onClick={() => sendMessageMutation.mutate()}
        disabled={!message.trim() || sendMessageMutation.isPending}
        className="w-full"
      >
        {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
      </Button>
    </div>
  );
};
