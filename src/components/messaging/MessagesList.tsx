
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, User, Reply } from 'lucide-react';
import { MessageThread } from './MessageThread';

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
    avatar_url?: string;
  };
  receiver: {
    first_name: string;
    last_name: string;
    role: string;
    avatar_url?: string;
  };
}

export const MessagesList = () => {
  const { user } = useAuth();
  const [selectedThread, setSelectedThread] = useState<{
    receiverId: string;
    receiverName: string;
  } | null>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(first_name, last_name, role, avatar_url),
          receiver:profiles!messages_receiver_id_fkey(first_name, last_name, role, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!user
  });

  // Group messages by conversation
  const conversations = React.useMemo(() => {
    const convMap = new Map();
    
    messages.forEach((message) => {
      const otherUserId = message.sender_id === user?.id ? message.receiver_id : message.sender_id;
      const otherUser = message.sender_id === user?.id ? message.receiver : message.sender;
      
      if (!convMap.has(otherUserId)) {
        convMap.set(otherUserId, {
          userId: otherUserId,
          userName: `${otherUser.first_name} ${otherUser.last_name}`,
          userRole: otherUser.role,
          avatar_url: otherUser.avatar_url,
          lastMessage: message,
          messageCount: 1
        });
      } else {
        const existing = convMap.get(otherUserId);
        existing.messageCount += 1;
        if (new Date(message.created_at) > new Date(existing.lastMessage.created_at)) {
          existing.lastMessage = message;
        }
      }
    });
    
    return Array.from(convMap.values()).sort((a, b) => 
      new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
    );
  }, [messages, user?.id]);

  if (isLoading) {
    return <div className="p-4">Loading messages...</div>;
  }

  if (selectedThread) {
    return (
      <MessageThread
        receiverId={selectedThread.receiverId}
        receiverName={selectedThread.receiverName}
        onBack={() => setSelectedThread(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Messages</h2>
      {conversations.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No messages yet</p>
          </CardContent>
        </Card>
      ) : (
        conversations.map((conversation) => (
          <Card key={conversation.userId} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {conversation.avatar_url ? (
                      <img 
                        src={conversation.avatar_url} 
                        alt={conversation.userName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      conversation.userName.split(' ').map(n => n[0]).join('')
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{conversation.userName}</p>
                    <span className="text-sm font-normal text-gray-500 capitalize">
                      ({conversation.userRole})
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedThread({
                    receiverId: conversation.userId,
                    receiverName: conversation.userName
                  })}
                >
                  <Reply className="w-4 h-4 mr-2" />
                  Reply
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-2 line-clamp-2">{conversation.lastMessage.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{conversation.messageCount} message{conversation.messageCount !== 1 ? 's' : ''}</span>
                <span>{new Date(conversation.lastMessage.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
