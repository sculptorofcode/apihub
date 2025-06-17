import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "../PostCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader, MessageSquare, Image, Zap, Plus, FileText, ChevronRight } from "lucide-react";
import { useAuth } from "../../contexts/auth/useAuth";
import { Post } from "../../components/postcard/types";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/contexts/auth/auth-types";

interface ActivityFeedProps {
  profile: User;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useAuth();
  const isOwnProfile = user?.id === profile.id;  // For demo purposes, we'll mock the followers count
  const followersCount: number = 0; // This would come from the API in a real app
  
  useEffect(() => {
    const fetchUserPosts = async () => {
      setIsLoading(true);
      try {
        // This would be a real API call in a production app
        // For now we're using a mock with the user's name
        const response = await fetch(`/feed?username=${profile.username}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts?.slice(0, 3) || []); // Just take first few posts for demo
        } else {
          console.error('Failed to fetch user posts');
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserPosts();
  }, [profile.username, token]);

  // Map of content types to their respective empty state messages
  const emptyStateMap = {
    posts: {
      icon: <FileText className="h-10 w-10 text-[var(--text-300)] dark:text-[var(--text-600)]" />,
      title: "No posts yet",
      description: "Share your thoughts, ideas, or questions with the community.",
      action: isOwnProfile ? "Create your first post" : undefined
    },
    comments: {
      icon: <MessageSquare className="h-10 w-10 text-[var(--text-300)] dark:text-[var(--text-600)]" />,
      title: "No comments yet",
      description: "Join conversations and share your thoughts.",
      action: isOwnProfile ? "Discover discussions" : undefined
    },
    images: {
      icon: <Image className="h-10 w-10 text-[var(--text-300)] dark:text-[var(--text-600)]" />,
      title: "No images yet",
      description: "Share visual content with your network.",
      action: isOwnProfile ? "Upload an image" : undefined
    }
  };

  const renderEmptyState = (type: 'posts' | 'comments' | 'images') => {
    const { icon, title, description, action } = emptyStateMap[type];
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center py-12 px-4 text-center"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.1 
          }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--background-100)] to-[var(--background-200)] dark:from-[var(--background-800)] dark:to-[var(--background-700)] flex items-center justify-center mb-4 shadow-inner"
        >
          {icon}
        </motion.div>
        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-medium text-[var(--text-900)] dark:text-[var(--text-50)] mb-2"
        >
          {title}
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)] mb-6 max-w-xs mx-auto"
        >
          {description}
        </motion.p>
        {isOwnProfile && action && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)]"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              {action}
            </Button>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <Card className="rounded-xl shadow-sm overflow-hidden border-[var(--border)] transform transition-all duration-300 hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-[var(--background-50)] to-[var(--background-100)] dark:from-[var(--background-900)] dark:to-[var(--background-800)] pb-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg text-[var(--text-900)] dark:text-[var(--text-50)] flex items-center gap-2">
            <div className="bg-[var(--primary-100)] dark:bg-[var(--primary-900/30)] p-1.5 rounded-lg">
              <Zap className="h-5 w-5 text-[var(--primary-500)]" />
            </div>
            <span>Activity</span>
            {followersCount > 0 && (
              <span className="text-sm font-normal text-[var(--text-500)]">
                ({followersCount} {followersCount === 1 ? 'follower' : 'followers'})
              </span>
            )}
          </h3>
          {isOwnProfile && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Post
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share something with your network</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 rounded-none bg-[var(--background-100)] dark:bg-[var(--background-800)]">
            <TabsTrigger value="posts" className="relative">
              Posts
              <motion.div
                className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-[var(--primary-500)]"
                initial={false}
                animate={{ opacity: activeTab === "posts" ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </TabsTrigger>
            <TabsTrigger value="comments" className="relative">
              Comments
              <motion.div
                className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-[var(--primary-500)]"
                initial={false}
                animate={{ opacity: activeTab === "comments" ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </TabsTrigger>
            <TabsTrigger value="images" className="relative">
              Images
              <motion.div
                className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-[var(--primary-500)]"
                initial={false}
                animate={{ opacity: activeTab === "images" ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            {/* Posts Tab */}
            <TabsContent key={'posts'} value="posts" className="mt-0 p-6">
              {isLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center py-12"
                >
                  <div className="flex flex-col items-center gap-4">
                    <Loader className="h-8 w-8 animate-spin text-[var(--primary-500)]" />
                    <span className="text-sm text-[var(--text-500)]">Loading posts...</span>
                  </div>
                </motion.div>
              ) : posts.length > 0 ? (
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <PostCard key={post.id} post={post} />
                    </motion.div>
                  ))}
                  {posts.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex justify-center pt-4"
                    >
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[var(--primary-600)] hover:text-[var(--primary-700)] group"
                        rightIcon={<ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                      >
                        View all posts
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              ) : renderEmptyState('posts')}
            </TabsContent>
          
            {/* Comments Tab */}
            <TabsContent key={'comments'} value="comments" className="mt-0 p-6">
              {renderEmptyState('comments')}
            </TabsContent>
          
            {/* Images Tab */}
            <TabsContent key={'images'} value="images" className="mt-0 p-6">
              {renderEmptyState('images')}
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
