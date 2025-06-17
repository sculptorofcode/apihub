import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Camera, Save, X, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/auth/useAuth';
import { useNavigate, Navigate } from 'react-router-dom';

const EditProfile: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, updateProfile, isAuthenticated, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    phone: ''
  });
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load user data into the form when available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        phone: user.phone || ''
      });
      
      // Set avatar preview if available
      if (typeof user.avatar === 'string') {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  // Basic form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }
    
    if (formData.website && !formData.website.match(/^https?:\/\/.+\..+/)) {
      errors.website = "Website must be a valid URL starting with http:// or https://";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      toast({
        title: "Form validation failed",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updateData = { ...formData };
      let result = false;
      
      if (avatarFile) {
        // We're handling the file separately from normal form data
        result = await updateProfile({ 
          ...updateData, 
          avatar: avatarFile 
        });
      } else {
        result = await updateProfile(updateData);
      }
      
      if (result) {
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
        navigate(`/profile/${formData.username}`);
      } else {
        toast({
          title: "Update failed",
          description: "Failed to update your profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Show loading state while auth is checking or form data is not ready
  if (authLoading || !user) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
            <CardDescription>Loading your profile...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 md:p-6 lg:max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt={formData.name} />
                    ) : (
                      <AvatarFallback className="text-lg">
                        {formData.name.split(' ').map(n => n?.[0] || '').join('')}
                      </AvatarFallback>
                    )}
                    <div className="absolute bottom-0 right-0 rounded-full bg-blue-500 p-1">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500">Click to change your profile picture</p>
              </div>
              
              {/* Profile Information */}
              <div className="space-y-4">                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className={formErrors.name ? "border-red-500" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {formErrors.name}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username"
                    name="username"
                    value={formData.username} 
                    onChange={handleInputChange}
                    placeholder="Username"
                    className={formErrors.username ? "border-red-500" : ""}
                  />
                  {formErrors.username && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {formErrors.username}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email" 
                    value={formData.email} 
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">Email cannot be changed</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio"
                    name="bio"
                    value={formData.bio || ''} 
                    onChange={handleInputChange}
                    placeholder="Tell others about yourself"
                  />
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location"
                      name="location" 
                      value={formData.location || ''} 
                      onChange={handleInputChange}
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                  <div className="space-y-2">                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website"
                      name="website" 
                      value={formData.website || ''} 
                      onChange={handleInputChange}
                      placeholder="e.g. https://example.com"
                      className={formErrors.website ? "border-red-500" : ""}
                    />
                    {formErrors.website && (
                      <p className="text-sm text-red-500 flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {formErrors.website}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone"
                    name="phone" 
                    value={formData.phone || ''} 
                    onChange={handleInputChange}
                    placeholder="e.g. +1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditProfile;
