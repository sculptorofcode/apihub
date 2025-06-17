
import React, { useState } from 'react';
import CommentItem from './CommentItem';
import ReplyInput from './ReplyInput';
import { Comment } from './types';

interface CommentsSectionProps {
  comments: Comment[];
  onCommentsChange: (comments: Comment[]) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ comments, onCommentsChange }) => {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleReplyClick = (commentId: string) => {
    setActiveReplyId(activeReplyId === commentId ? null : commentId);
    setReplyText('');
  };

  const handleReplySubmit = (parentCommentId: string) => {
    if (!replyText.trim()) return;

    const newReply: Comment = {
      id: `${parentCommentId}-${Date.now()}`,
      author: { 
        name: 'You', 
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face' 
      },
      content: replyText.trim(),
      createdAt: new Date().toISOString(),
      likes: 0
    };

    const updatedComments = comments.map(comment => {
      if (comment.id === parentCommentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      }
      // Handle replies to nested comments
      if (comment.replies) {
        const updatedReplies = comment.replies.map(reply => {
          if (reply.id === parentCommentId) {
            return {
              ...reply,
              replies: [...(reply.replies || []), newReply]
            };
          }
          return reply;
        });
        if (updatedReplies !== comment.replies) {
          return { ...comment, replies: updatedReplies };
        }
      }
      return comment;
    });

    onCommentsChange(updatedComments);
    setActiveReplyId(null);
    setReplyText('');
  };

  const handleReplyCancel = () => {
    setActiveReplyId(null);
    setReplyText('');
  };

  const renderComment = (comment: Comment, indentLevel: number = 0) => (
    <div key={comment.id} className="space-y-4">
      {/* Main Comment */}
      <CommentItem
        comment={comment}
        onReplyClick={() => handleReplyClick(comment.id)}
        isNested={indentLevel > 0}
      />

      {/* Reply Input */}
      {activeReplyId === comment.id && (
        <ReplyInput
          value={replyText}
          onChange={setReplyText}
          onSubmit={() => handleReplySubmit(comment.id)}
          onCancel={handleReplyCancel}
          isSubmitDisabled={!replyText.trim()}
          indentLevel={indentLevel}
        />
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 space-y-3">
          {comment.replies.map((reply) => (
            <div key={reply.id}>
              <CommentItem
                comment={reply}
                onReplyClick={() => handleReplyClick(reply.id)}
                isNested={true}
              />
              {/* Reply to reply input */}
              {activeReplyId === reply.id && (
                <ReplyInput
                  value={replyText}
                  onChange={setReplyText}
                  onSubmit={() => handleReplySubmit(reply.id)}
                  onCancel={handleReplyCancel}
                  isSubmitDisabled={!replyText.trim()}
                  indentLevel={1}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      <h2 className="text-xl font-semibold text-[var(--text-900)] dark:text-[var(--text-50)]">
        Comments ({comments.length})
      </h2>
      
      <div className="space-y-6">
        {comments.map((comment) => renderComment(comment))}
      </div>
    </div>
  );
};

export default CommentsSection;
