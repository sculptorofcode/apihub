import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/useAuth';
import { useToast } from '../../hooks/use-toast';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await forgotPassword(email);

      if (success) {
        toast({
          title: "Email sent",
          description: "Check your email for password reset instructions",
        });

        // Redirect to login page after short delay
        setTimeout(() => navigate('/auth/login'), 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
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
              Sending Reset Link
            </>
          ) : (
            "Send Reset Link"
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

export default ForgotPassword;
