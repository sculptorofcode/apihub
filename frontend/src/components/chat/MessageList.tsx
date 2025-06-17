
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

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

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  getUser: (userId: string) => User | undefined;
  formatTime: (dateString: string) => string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  getUser,
  formatTime,
}) => {
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === currentUserId;
            const sender = getUser(message.senderId);
            
            return (
              <div
                key={message.messageId}
                className={cn(
                  "flex",
                  isCurrentUser ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] p-3 rounded-lg",
                    isCurrentUser
                      ? "bg-[var(--primary-500)] text-white"
                      : "bg-[var(--background-200)] dark:bg-[var(--background-700)] text-[var(--text-900)] dark:text-[var(--text-50)]"
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <span
                    className={cn(
                      "text-xs mt-1 block",
                      isCurrentUser
                        ? "text-blue-100"
                        : "text-[var(--text-500)] dark:text-[var(--text-500)]"
                    )}
                  >
                    {formatTime(message.sentAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageList;
