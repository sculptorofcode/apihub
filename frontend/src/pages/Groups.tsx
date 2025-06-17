
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Plus, MessageCircle, TrendingUp, Lock, Globe } from 'lucide-react';

const Groups = () => {
  const featuredGroups = [
    {
      id: 1,
      name: "AI Innovators",
      description: "Exploring the latest in artificial intelligence and machine learning applications",
      members: 1248,
      posts: 324,
      isPrivate: false,
      category: "Technology",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
      recentActivity: "2 hours ago"
    },
    {
      id: 2,
      name: "Sustainable Startups",
      description: "Building businesses that make a positive environmental impact",
      members: 892,
      posts: 156,
      isPrivate: false,
      category: "Environment",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=200&fit=crop",
      recentActivity: "4 hours ago"
    },
    {
      id: 3,
      name: "FinTech Founders",
      description: "Revolutionizing financial services through technology",
      members: 567,
      posts: 89,
      isPrivate: true,
      category: "Finance",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop",
      recentActivity: "1 day ago"
    }
  ];

  const myGroups = [
    {
      id: 4,
      name: "EdTech Enthusiasts",
      members: 234,
      unreadPosts: 5,
      lastActive: "30 minutes ago"
    },
    {
      id: 5,
      name: "Healthcare Innovation",
      members: 445,
      unreadPosts: 2,
      lastActive: "2 hours ago"
    },
    {
      id: 6,
      name: "Social Impact Makers",
      members: 678,
      unreadPosts: 0,
      lastActive: "1 day ago"
    }
  ];

  const categories = [
    { name: "Technology", count: 45, color: "bg-blue-100 text-blue-800" },
    { name: "Healthcare", count: 23, color: "bg-green-100 text-green-800" },
    { name: "Environment", count: 34, color: "bg-emerald-100 text-emerald-800" },
    { name: "Education", count: 18, color: "bg-purple-100 text-purple-800" },
    { name: "Finance", count: 29, color: "bg-yellow-100 text-yellow-800" },
    { name: "Social Impact", count: 16, color: "bg-orange-100 text-orange-800" }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)] mb-4">
              Groups
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with like-minded innovators and collaborate on ideas
            </p>
          </div>
          
          <Button className="bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Groups */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)] mb-6">
                My Groups
              </h2>
              
              <div className="space-y-4">
                {myGroups.map((group) => (
                  <Card key={group.id} className="p-4 hover:shadow-lg transition-shadow bg-[var(--background-50)] dark:bg-[var(--background-800)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`https://images.unsplash.com/photo-${1500000000000 + group.id}?w=100&h=100&fit=crop`} />
                          <AvatarFallback className="bg-[var(--secondary-300)] text-[var(--text-900)]">
                            {group.name.split(' ').map(word => word[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h3 className="font-semibold text-[var(--text-900)] dark:text-[var(--text-50)]">
                            {group.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {group.members} members
                            </span>
                            <span>Active {group.lastActive}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {group.unreadPosts > 0 && (
                          <Badge variant="secondary" className="bg-[var(--accent-500)] text-white">
                            {group.unreadPosts} new
                          </Badge>
                        )}
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Featured Groups */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)] mb-6">
                Featured Groups
              </h2>
              
              <div className="grid gap-6">
                {featuredGroups.map((group) => (
                  <Card key={group.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-[var(--background-50)] dark:bg-[var(--background-800)]">
                    <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${group.image})` }}>
                      <div className="h-full bg-black/40 flex items-end p-4">
                        <div className="flex items-center space-x-2">
                          {group.isPrivate ? (
                            <Lock className="h-4 w-4 text-white" />
                          ) : (
                            <Globe className="h-4 w-4 text-white" />
                          )}
                          <Badge variant="secondary" className="bg-white/20 text-white">
                            {group.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-2">
                        {group.name}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4">
                        {group.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {group.members.toLocaleString()} members
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {group.posts} posts
                          </span>
                          <span className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Active {group.recentActivity}
                          </span>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          {group.isPrivate ? 'Request to Join' : 'Join Group'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Group Stats */}
            <Card className="p-6 bg-[var(--background-50)] dark:bg-[var(--background-800)]">
              <h3 className="font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-4">
                Community Stats
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Groups</span>
                  <span className="font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">165</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Members</span>
                  <span className="font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">12,347</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weekly Posts</span>
                  <span className="font-medium text-[var(--text-900)] dark:text-[var(--text-50)]">1,234</span>
                </div>
              </div>
            </Card>

            {/* Categories */}
            <Card className="p-6 bg-[var(--background-50)] dark:bg-[var(--background-800)]">
              <h3 className="font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-4">
                Browse by Category
              </h3>
              
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-between hover:bg-[var(--primary-50)]"
                  >
                    <span>{category.name}</span>
                    <Badge className={category.color}>
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;
