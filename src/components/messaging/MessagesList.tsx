
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, User } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender: {
    first_name: string;
    last_name: string;
    role: string;
  };
  receiver: {
    first_name: string;
    last_name: string;
    role: string;
  };
}

export const MessagesList = () => {
  const { user } = useAuth();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(first_name, last_name, role),
          receiver:profiles!messages_receiver_id_fkey(first_name, last_name, role)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!user
  });

  if (isLoading) {
    return <div className="p-4">Loading messages...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Messages</h2>
      {messages.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No messages yet</p>
          </CardContent>
        </Card>
      ) : (
        messages.map((message) => {
          const otherUser = message.sender_id === user?.id ? message.receiver : message.sender;
          return (
            <Card key={message.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {otherUser.first_name} {otherUser.last_name}
                  <span className="text-sm font-normal text-gray-500 capitalize">
                    ({otherUser.role})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">{message.content}</p>
                <p className="text-sm text-gray-500">
                  {new Date(message.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};
