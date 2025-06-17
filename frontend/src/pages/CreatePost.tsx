
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Lightbulb, Save, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isDraft, setIsDraft] = useState(false);

  const categories = [
    'Technology',
    'Healthcare',
    'Environment',
    'Education',
    'Finance',
    'Social Impact',
    'Entertainment',
    'Transportation',
    'Food & Agriculture',
    'Energy'
  ];

  const suggestedTags = [
    'AI', 'Machine Learning', 'Startup', 'Innovation', 'SaaS', 'Mobile App',
    'Web3', 'Blockchain', 'Sustainability', 'FinTech', 'EdTech', 'HealthTech',
    'IoT', 'AR/VR', 'Automation', 'Data Science', 'Cloud', 'Cybersecurity'
  ];

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault();
    setIsDraft(saveAsDraft);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate back to feed
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-[var(--primary-500)]/10 border-2 border-[var(--primary-500)]/20">
              <Lightbulb className="h-8 w-8 text-[var(--primary-500)]" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)] mb-4">
            Share Your Idea
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your innovative thoughts into reality by sharing them with our community of creators and entrepreneurs
          </p>
        </div>

        {/* Form */}
        <Card className="p-8 bg-[var(--background-50)] dark:bg-[var(--background-800)]">
          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">
                Idea Title *
              </Label>
              <Input
                id="title"
                placeholder="Give your idea a compelling title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg border-[var(--primary-300)] focus:border-[var(--primary-500)]"
                required
              />
              <p className="text-sm text-muted-foreground">
                Make it clear and engaging - this is what people will see first
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">
                Category *
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="border-[var(--primary-300)] focus:border-[var(--primary-500)]">
                  <SelectValue placeholder="Select a category for your idea" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">
                Describe Your Idea *
              </Label>
              <Textarea
                id="description"
                placeholder="Share the details of your idea, the problem it solves, how it works, and what makes it unique..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[200px] border-[var(--primary-300)] focus:border-[var(--primary-500)]"
                required
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Be specific about the problem, solution, and target audience
                </p>
                <span className={`text-sm ${description.length > 500 ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {description.length} characters
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <Label className="text-base font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">
                Tags (Optional)
              </Label>
              
              {/* Current Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-[var(--primary-300)] text-[var(--text-900)] pr-1"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:bg-red-500 hover:text-white rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add Tag Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(currentTag);
                    }
                  }}
                  className="border-[var(--primary-300)] focus:border-[var(--primary-500)]"
                  disabled={tags.length >= 5}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addTag(currentTag)}
                  disabled={!currentTag || tags.includes(currentTag) || tags.length >= 5}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Suggested Tags */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Suggested tags:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags
                    .filter(tag => !tags.includes(tag))
                    .slice(0, 8)
                    .map((tag, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTag(tag)}
                        disabled={tags.length >= 5}
                        className="text-xs hover:bg-[var(--primary-50)] hover:border-[var(--primary-300)]"
                      >
                        #{tag}
                      </Button>
                    ))}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Add up to 5 tags to help others discover your idea. Tags make your post more searchable.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={!title || !description || !category}
                  className="flex-1 sm:flex-none"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  disabled={!title || !description || !category}
                  className="flex-1 sm:flex-none"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
              
              <div className="flex gap-3 sm:ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  disabled={!title || !description || !category}
                  className="flex-1 sm:flex-none bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Publish Idea
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Tips */}
        <Card className="mt-6 p-6 bg-[var(--accent-50)] dark:bg-[var(--accent-900)]/20 border-[var(--accent-300)]">
          <h3 className="font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-3">
            💡 Tips for a Great Post
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong>Be specific:</strong> Clearly explain the problem your idea solves</li>
            <li>• <strong>Add context:</strong> Who is your target audience? What's the market opportunity?</li>
            <li>• <strong>Show passion:</strong> Why are you excited about this idea?</li>
            <li>• <strong>Invite feedback:</strong> Ask specific questions to get better responses</li>
            <li>• <strong>Use relevant tags:</strong> Help others discover your idea through proper tagging</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default CreatePost;
