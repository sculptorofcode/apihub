
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, UserPlus, MessageCircle, UserMinus, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import users from '../../resources/users.json';

const Friends: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock current user
  const currentUser = users[0];
  
  // Get followers and following
  const followers = users.filter(user => currentUser.followers.includes(user.id));
  const following = users.filter(user => currentUser.following.includes(user.id));
  const mutualConnections = users.filter(user => 
    currentUser.followers.includes(user.id) && currentUser.following.includes(user.id)
  );

  // Suggested friends (users not currently following)
  const suggestedFriends = users.filter(user => 
    user.id !== currentUser.id && !currentUser.following.includes(user.id)
  ).slice(0, 6);

  const handleFollow = (userId: string) => {
    toast({
      title: "Following user",
      description: "You are now following this user.",
    });
  };

  const handleUnfollow = (userId: string) => {
    toast({
      title: "Unfollowed user",
      description: "You have unfollowed this user.",
    });
  };

  const handleMessage = (userId: string) => {
    toast({
      title: "Message sent",
      description: "Starting a conversation...",
    });
  };

  const UserCard: React.FC<{ 
    user: typeof users[0]; 
    isFollowing?: boolean; 
    showActions?: boolean;
  }> = ({ user, isFollowing = false, showActions = true }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.profilePicture} alt={user.fullName} />
            <AvatarFallback className="bg-[var(--secondary-300)] text-[var(--text-900)]">
              {user.fullName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] truncate">
              {user.fullName}
            </h3>
            <p className="text-sm text-[var(--text-600)] dark:text-[var(--text-400)] truncate">
              @{user.username}
            </p>
            <p className="text-xs text-[var(--text-500)] dark:text-[var(--text-500)] truncate mt-1">
              {user.bio}
            </p>
            <div className="flex items-center mt-2 space-x-2">
              <Badge variant="secondary" className="text-xs">
                {user.reputation} rep
              </Badge>
              <span className="text-xs text-[var(--text-500)] dark:text-[var(--text-500)]">
                {user.followers.length} followers
              </span>
            </div>
          </div>
          
          {showActions && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMessage(user.id)}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              
              {isFollowing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnfollow(user.id)}
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleFollow(user.id)}
                  className="bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const filteredUsers = (userList: typeof users) => 
    userList.filter(user =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)] mb-4">
            Friends & Connections
          </h1>
          <p className="text-[var(--text-700)] dark:text-[var(--text-300)]">
            Manage your network and discover new connections
          </p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="following" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="following">Following ({following.length})</TabsTrigger>
            <TabsTrigger value="followers">Followers ({followers.length})</TabsTrigger>
            <TabsTrigger value="mutual">Mutual ({mutualConnections.length})</TabsTrigger>
            <TabsTrigger value="suggested">Suggested</TabsTrigger>
          </TabsList>
          
          <TabsContent value="following" className="space-y-4">
            {filteredUsers(following).length > 0 ? (
              filteredUsers(following).map((user) => (
                <UserCard key={user.id} user={user} isFollowing={true} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-[var(--text-400)]" />
                  <h3 className="text-lg font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-2">
                    {searchQuery ? 'No matching users' : 'Not following anyone yet'}
                  </h3>
                  <p className="text-[var(--text-600)] dark:text-[var(--text-400)]">
                    {searchQuery ? 'Try a different search term.' : 'Start following people to see their updates in your feed.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="followers" className="space-y-4">
            {filteredUsers(followers).length > 0 ? (
              filteredUsers(followers).map((user) => (
                <UserCard key={user.id} user={user} isFollowing={currentUser.following.includes(user.id)} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-[var(--text-400)]" />
                  <h3 className="text-lg font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-2">
                    {searchQuery ? 'No matching followers' : 'No followers yet'}
                  </h3>
                  <p className="text-[var(--text-600)] dark:text-[var(--text-400)]">
                    {searchQuery ? 'Try a different search term.' : 'Share interesting ideas to attract followers.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="mutual" className="space-y-4">
            {filteredUsers(mutualConnections).length > 0 ? (
              filteredUsers(mutualConnections).map((user) => (
                <UserCard key={user.id} user={user} isFollowing={true} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-[var(--text-400)]" />
                  <h3 className="text-lg font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-2">
                    No mutual connections
                  </h3>
                  <p className="text-[var(--text-600)] dark:text-[var(--text-400)]">
                    Mutual connections will appear here when you follow each other.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="suggested" className="space-y-4">
            {suggestedFriends.map((user) => (
              <UserCard key={user.id} user={user} isFollowing={false} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Friends;
