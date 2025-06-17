import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/useAuth';
import { Loader2, Mail, User, UserCheck, Lock, Check, X, AlertCircle } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import PasswordInput from '../../components/auth/PasswordInput';
import { useDebounce } from '../../hooks/useDebounce';
import { StatusAnimation } from '../../components/ui/status-animation';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [usernameState, setUsernameState] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const { register, checkUsernameAvailability } = useAuth();
  const navigate = useNavigate();
  
  // Debounce the username to avoid excessive API calls
  const debouncedUsername = useDebounce(formData.username, 500);

  // Check username availability whenever debounced username changes
  useEffect(() => {
    const checkUsername = async () => {
      if (debouncedUsername && debouncedUsername.length > 2) {
        setUsernameState('checking');
        const isAvailable = await checkUsernameAvailability(debouncedUsername);
        setUsernameState(isAvailable ? 'available' : 'taken');
        
        // Update errors state based on availability
        if (!isAvailable) {
          setErrors(prev => ({ ...prev, username: 'This username is already taken' }));
        } else {
          // Remove username error if it exists
          setErrors(prev => {
            const newErrors = { ...prev };
            if (newErrors.username === 'This username is already taken') {
              delete newErrors.username;
            }
            return newErrors;
          });
        }
      } else {
        setUsernameState('idle');
      }
    };

    checkUsername();
  }, [debouncedUsername, checkUsernameAvailability]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.username) newErrors.username = 'Username is required';
    else if (usernameState === 'taken') newErrors.username = 'This username is already taken';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Don't submit if username is being checked or is taken
    if (usernameState === 'checking') {
      setErrors(prev => ({ ...prev, username: 'Please wait while we check username availability' }));
      return;
    }
    
    if (usernameState === 'taken') {
      setErrors(prev => ({ ...prev, username: 'This username is already taken' }));
      return;
    }
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const success = await register(
        formData.name,
        formData.email,
        formData.username,
        formData.password,
        formData.password_confirmation
      );

      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear error when field is being edited
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
    
    // Reset username state to idle when typing
    if (name === 'username' && usernameState !== 'idle') {
      setUsernameState('idle');
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.name && <p className="text-sm font-medium text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.email && <p className="text-sm font-medium text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <UserCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              className={`pl-10 ${
                errors.username 
                  ? 'border-destructive pr-10' 
                  : usernameState === 'available' && formData.username.length >= 3
                    ? 'border-green-500 pr-10' 
                    : usernameState === 'checking' || usernameState === 'taken'
                      ? 'pr-10'
                      : ''
              }`}
            />
            {formData.username.length >= 3 && (
              <>
                {usernameState === 'checking' && (
                  <div className="absolute right-3 top-3">
                    <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                  </div>
                )}
                {usernameState === 'available' && (
                  <StatusAnimation status="available" className="absolute right-3 top-3 text-green-500">
                    <Check className="h-4 w-4" />
                  </StatusAnimation>
                )}
                {usernameState === 'taken' && (
                  <StatusAnimation status="taken" className="absolute right-3 top-3 text-destructive">
                    <X className="h-4 w-4" />
                  </StatusAnimation>
                )}
              </>
            )}
          </div>          {errors.username && <p className="text-sm font-medium text-destructive">{errors.username}</p>}
          
          {!errors.username && formData.username.length >= 3 && (
            <>
              {usernameState === 'available' && (
                <StatusAnimation status="available" className="mt-1">
                  <p className="text-sm text-green-500 flex items-center">
                    <Check className="mr-1.5 h-4 w-4" />
                    Username is available
                  </p>
                </StatusAnimation>
              )}
              {usernameState === 'taken' && (
                <StatusAnimation status="taken" className="mt-1">
                  <p className="text-sm text-destructive flex items-center">
                    <AlertCircle className="mr-1.5 h-4 w-4" />
                    This username is already taken
                  </p>
                </StatusAnimation>
              )}
            </>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            <PasswordInput
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="pl-10"
              error={errors.password}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password_confirmation">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            <PasswordInput
              id="password_confirmation"
              name="password_confirmation"
              placeholder="••••••••"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="pl-10"
              error={errors.password_confirmation}
            />
          </div>
        </div>

        <Button
          variant="primary"
          type="submit"
          className="w-full font-semibold"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterPage;
