import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/useAuth';
import { Loader2, Mail, Lock, AtSign } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import PasswordInput from '../../components/auth/PasswordInput';

const LoginPage: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ login?: string; password?: string }>({});

  const { login: loginFn } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { login?: string; password?: string } = {};
    if (!login) newErrors.login = 'Email or username is required';
    if (!password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const success = await loginFn(login, password);
      if (success) {
        navigate('/'); // Redirect to home page after login
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login">Email or Username</Label>
          <div className="relative">            <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            <Input
              id="login"
              type="text"
              placeholder="name@example.com or username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className={`pl-10 ${errors.login ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.login && <p className="text-sm font-medium text-destructive">{errors.login}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/auth/forgot-password" className="text-sm font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-50" />
            <PasswordInput
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              error={errors.password}
            />
          </div>
        </div>

        <Button
          variant='primary'
          type="submit"
          className="w-full font-semibold"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/auth/register" className="font-medium text-primary hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginPage;
