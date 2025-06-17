import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, BookmarkIcon, Filter } from 'lucide-react';
import PostCard from '../components/PostCard';
import posts from '../../resources/posts.json';
import users from '../../resources/users.json';
import { Post } from '../components/postcard/types';

const Bookmarks: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Transform posts data to match PostCard interface
  const transformedPosts = posts.map(post => {
    const author = users.find(user => user.id === post.authorId);
    return {
      id: post.id,
      title: post.title,
      description: post.content,
      author: {
        id: post.authorId,
        name: author?.fullName || 'Unknown Author',
        avatar: author?.profilePicture
      },
      tags: post.tags,
      likes: post.likes,
      comments: post.commentsCount,
      bookmarks: post.bookmarks,
      isLiked: false,
      isBookmarked: true,
      createdAt: post.createdAt
    } as Post;
  });

  // Mock bookmarked posts (in real app, this would come from API)
  const bookmarkedPostIds = ['post-1', 'post-3', 'post-5', 'post-8'];
  const bookmarkedPosts = transformedPosts.filter(post => bookmarkedPostIds.includes(post.id));

  // Get all unique tags from bookmarked posts
  const allTags = Array.from(new Set(bookmarkedPosts.flatMap(post => post.tags)));

  // Filter posts based on search and tag
  const filteredPosts = bookmarkedPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handlePostLike = (postId: string) => {
    console.log('Like post:', postId);
  };

  const handlePostBookmark = (postId: string) => {
    console.log('Remove bookmark:', postId);
    // In real app, this would remove the post from bookmarks
  };

  const handlePostNavigate = (postId: string) => {
    console.log('Navigate to post:', postId);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)] mb-4">
            My Bookmarks
          </h1>
          <p className="text-[var(--text-700)] dark:text-[var(--text-300)]">
            Ideas you've saved for later reading
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookmarked posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Sort by Date
              </Button>
            </div>

            {/* Tag Filter */}
            {allTags.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedTag === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(null)}
                  >
                    All Tags
                  </Button>
                  {allTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bookmarked Posts */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handlePostLike}
                onBookmark={handlePostBookmark}
                onNavigate={handlePostNavigate}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <BookmarkIcon className="h-12 w-12 mx-auto mb-4 text-[var(--text-400)]" />
              <h3 className="text-lg font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-2">
                {searchQuery || selectedTag ? 'No matching bookmarks' : 'No bookmarks yet'}
              </h3>
              <p className="text-[var(--text-600)] dark:text-[var(--text-400)] mb-4">
                {searchQuery || selectedTag 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Start bookmarking interesting ideas to save them for later.'
                }
              </p>
              {(searchQuery || selectedTag) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag(null);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
