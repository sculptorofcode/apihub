
import React, { useState } from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';
import conversations from '../../resources/conversations.json';
import users from '../../resources/users.json';

type FilterType = 'all' | 'group';

const Chat: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(conversations[0]?.id || null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  // Mock current user
  const currentUserId = 'user-1';

  // Mock group conversations (in real app this would come from API)
  const mockGroupConversations = [
    { id: 'group-conv-1', name: 'AI Innovators Group', isGroup: true },
    { id: 'group-conv-2', name: 'Startup Founders', isGroup: true }
  ];

  const getUser = (userId: string) => users.find(user => user.id === userId);

  const getConversationPartner = (conversation: typeof conversations[0]) => {
    const partnerId = conversation.participantIds.find(id => id !== currentUserId);
    return partnerId ? getUser(partnerId) : null;
  };

  const isGroupConversation = (conversationId: string) => {
    return mockGroupConversations.some(group => group.id === conversationId);
  };

  const filteredConversations = conversations.filter(conv => {
    const partner = getConversationPartner(conv);
    if (!partner && !isGroupConversation(conv.id)) return false;
    
    // Apply filter
    if (filter === 'group' && !isGroupConversation(conv.id)) return false;
    
    // Apply search
    if (isGroupConversation(conv.id)) {
      const groupInfo = mockGroupConversations.find(g => g.id === conv.id);
      return groupInfo?.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (partner) {
      return partner.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             partner.username.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return false;
  });

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);
  const selectedPartner = selectedConv ? getConversationPartner(selectedConv) : null;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-screen bg-[var(--background)] flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto w-full flex">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full h-full">
          <ChatSidebar
            filteredConversations={filteredConversations}
            selectedConversation={selectedConversation}
            searchQuery={searchQuery}
            filter={filter}
            onConversationSelect={setSelectedConversation}
            onSearchChange={setSearchQuery}
            onFilterChange={setFilter}
            getUser={getUser}
            getConversationPartner={getConversationPartner}
            isGroupConversation={isGroupConversation}
            mockGroupConversations={mockGroupConversations}
            formatTime={formatTime}
          />
          
          <ChatWindow
            selectedConv={selectedConv}
            selectedPartner={selectedPartner}
            currentUserId={currentUserId}
            newMessage={newMessage}
            onMessageChange={setNewMessage}
            onSendMessage={handleSendMessage}
            getUser={getUser}
            formatTime={formatTime}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
