
import React from 'react';
import { Card } from '@/components/ui/card';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface User {
  id: string;
  fullName: string;
  username: string;
  profilePicture: string;
}

interface Message {
  messageId: string;
  senderId: string;
  text: string;
  sentAt: string;
  type: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: Message[];
}

interface ChatWindowProps {
  selectedConv: Conversation | undefined;
  selectedPartner: User | null;
  currentUserId: string;
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  getUser: (userId: string) => User | undefined;
  formatTime: (dateString: string) => string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedConv,
  selectedPartner,
  currentUserId,
  newMessage,
  onMessageChange,
  onSendMessage,
  getUser,
  formatTime,
}) => {
  if (!selectedConv || !selectedPartner) {
    return (
      <Card className="lg:col-span-2 h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-2">
            Select a conversation
          </h3>
          <p className="text-[var(--text-600)] dark:text-[var(--text-400)]">
            Choose a conversation from the list to start messaging
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 h-full flex flex-col">
      <ChatHeader partner={selectedPartner} />
      <MessageList
        messages={selectedConv.messages}
        currentUserId={currentUserId}
        getUser={getUser}
        formatTime={formatTime}
      />
      <MessageInput
        newMessage={newMessage}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
      />
    </Card>
  );
};

export default ChatWindow;
