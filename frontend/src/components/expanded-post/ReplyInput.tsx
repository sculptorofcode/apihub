
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ReplyInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitDisabled: boolean;
  indentLevel?: number;
}

const ReplyInput: React.FC<ReplyInputProps> = ({
  value,
  onChange,
  onSubmit,
  onCancel,
  isSubmitDisabled,
  indentLevel = 0
}) => {
  return (
    <div className={`mt-3 ${indentLevel > 0 ? 'ml-12' : 'ml-12'}`}>
      <div className="bg-[var(--background-100)] dark:bg-[var(--background-700)] rounded-lg p-3 border border-[var(--primary-300)]">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write a reply..."
          className="min-h-[80px] resize-none border-0 p-0 bg-transparent focus-visible:ring-0 text-[var(--text-700)] dark:text-[var(--text-300)]"
          autoFocus
        />
        <div className="flex justify-end space-x-2 mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-muted-foreground hover:text-[var(--text-700)]"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white"
          >
            <Send className="h-3 w-3 mr-1" />
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReplyInput;
