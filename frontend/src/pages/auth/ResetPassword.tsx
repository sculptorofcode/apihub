import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/useAuth';
import { useToast } from '../../hooks/use-toast';
import { Loader2, Lock, ArrowLeft } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import PasswordInput from '../../components/auth/PasswordInput';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<{ password?: string; passwordConfirmation?: string }>({});
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const { toast } = useToast();

  useEffect(() => {
    if (!token || !email) {
      toast({
        title: "Invalid reset link",
        description: "The password reset link is invalid or expired. Please request a new one.",
        variant: "destructive",
      });
      navigate('/auth/forgot-password');
    }
  }, [token, email, navigate, toast]);

  const validateForm = () => {
    const newErrors: { password?: string; passwordConfirmation?: string } = {};

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (!passwordConfirmation) newErrors.passwordConfirmation = 'Please confirm your password';
    else if (password !== passwordConfirmation) newErrors.passwordConfirmation = 'Passwords do not match';

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Only proceed if token and email are available
      if (token && email) {
        const success = await resetPassword(token, email, password, passwordConfirmation);

        if (success) {
          toast({
            title: "Password reset successful",
            description: "You can now login with your new password",
          });

          // Redirect to login page after short delay
          setTimeout(() => navigate('/auth/login'), 2000);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // If token or email is missing, show minimal UI
  if (!token || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="bg-background p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold">Invalid Reset Link</h2>
          <p className="mt-2 text-muted-foreground">Redirecting to password reset request page...</p>
          <div className="mt-6">
            <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            <PasswordInput
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              error={error.password}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password-confirmation">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            <PasswordInput
              id="password-confirmation"
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="pl-10"
              error={error.passwordConfirmation}
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
              Resetting Password
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </div>

      <div className="text-center">
        <Button
          variant="link"
          onClick={() => navigate('/auth/login')}
          className="flex items-center gap-1 mx-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Button>
      </div>
    </form>
  );
};

export default ResetPassword;
