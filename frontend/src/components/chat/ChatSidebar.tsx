
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Search, MessageCircle, Users } from 'lucide-react';
import ConversationItem from './ConversationItem';

interface User {
  id: string;
  fullName: string;
  username: string;
  profilePicture: string;
}

interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface ChatSidebarProps {
  filteredConversations: Conversation[];
  selectedConversation: string | null;
  searchQuery: string;
  filter: 'all' | 'group';
  onConversationSelect: (id: string) => void;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: 'all' | 'group') => void;
  getUser: (userId: string) => User | undefined;
  getConversationPartner: (conversation: Conversation) => User | null;
  isGroupConversation: (conversationId: string) => boolean;
  mockGroupConversations: Array<{ id: string; name: string; isGroup: boolean }>;
  formatTime: (dateString: string) => string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  filteredConversations,
  selectedConversation,
  searchQuery,
  filter,
  onConversationSelect,
  onSearchChange,
  onFilterChange,
  getUser,
  getConversationPartner,
  isGroupConversation,
  mockGroupConversations,
  formatTime,
}) => {
  return (
    <Card className="lg:col-span-1 flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
          Messages
        </CardTitle>
        
        {/* Filter Toggle */}
        <div className="mb-4">
          <ToggleGroup 
            type="single" 
            value={filter} 
            onValueChange={(value) => value && onFilterChange(value as 'all' | 'group')}
            className="w-full"
          >
            <ToggleGroupItem 
              value="all" 
              className="flex-1 data-[state=on]:bg-[var(--primary-500)] data-[state=on]:text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              All
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="group" 
              className="flex-1 data-[state=on]:bg-[var(--primary-500)] data-[state=on]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Group
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      
      {/* Scrollable Chat List */}
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
          <div className="space-y-1">
            {filteredConversations.map((conversation) => {
              const partner = getConversationPartner(conversation);
              const isGroup = isGroupConversation(conversation.id);
              const groupInfo = isGroup ? mockGroupConversations.find(g => g.id === conversation.id) : null;

              return (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  partner={partner}
                  isGroup={isGroup}
                  groupName={groupInfo?.name}
                  isSelected={selectedConversation === conversation.id}
                  onClick={() => onConversationSelect(conversation.id)}
                  formatTime={formatTime}
                />
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatSidebar;
