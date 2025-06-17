import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/auth/useAuth';
import { useToast } from '../../hooks/use-toast';
import { Loader2, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const VerifyEmail = () => {
    const [isVerifying, setIsVerifying] = useState(true);
    const [isResending, setIsResending] = useState(false);
    const [verificationSuccess, setVerificationSuccess] = useState<boolean | null>(null);
    const [email, setEmail] = useState('');
    const [searchParams] = useSearchParams();
    const { verifyEmail, resendVerificationEmail } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    
    // Use a ref to track if verification has been attempted
    const verificationAttempted = useRef(false);

    useEffect(() => {
        const verifyEmailAddress = async () => {
            // Skip if verification has already been attempted
            if (verificationAttempted.current) {
                return;
            }

            const id = searchParams.get('id');
            const hash = searchParams.get('hash');
            const expires = searchParams.get('expires');
            const signature = searchParams.get('signature');

            if (!expires || !signature) {
                setIsVerifying(false);
                setVerificationSuccess(false);
                return;
            }

            try {
                // Mark that we've attempted verification
                verificationAttempted.current = true;
                
                const success = await verifyEmail(id, hash, expires, signature);
                setVerificationSuccess(success);

                if (success) {
                    // Redirect to login after successful verification (with delay)
                    setTimeout(() => {
                        navigate('/auth/login');
                    }, 3000);
                }
            } catch (error) {
                setVerificationSuccess(false);
            } finally {
                setIsVerifying(false);
            }
        };

        verifyEmailAddress();
    }, [searchParams, verifyEmail, navigate]);

    const handleResendVerification = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast({
                title: "Error",
                description: "Please enter your email address",
                variant: "destructive",
            });
            return;
        }

        setIsResending(true);
        try {
            await resendVerificationEmail(email);
        } finally {
            setIsResending(false);
        }
    };

    if (isVerifying) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <h2 className="text-2xl font-bold">Verifying your email address</h2>
                <p className="text-muted-foreground">This will only take a moment...</p>
            </div>
        );
    }

    if (verificationSuccess) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <h2 className="text-2xl font-bold">Email verified successfully!</h2>
                <p className="text-muted-foreground">Your email address has been confirmed.</p>
                <p className="text-muted-foreground">You will be redirected to login shortly.</p>
                <Link to="/auth/login">
                    <Button variant="primary" className="mt-4 w-full">
                        Continue to Login
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <XCircle className="h-16 w-16 text-red-500" />
            <h2 className="text-2xl font-bold">Verification Failed</h2>
            <p className="text-muted-foreground">
                We couldn't verify your email address. The link may have expired or is invalid.
            </p>

            <div className="mt-8 w-full max-w-md">
                <h3 className="text-lg font-medium mb-4">Resend Verification Email</h3>
                <form onSubmit={handleResendVerification} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" variant="primary" className="w-full" disabled={isResending}>
                        {isResending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Resend Verification Link
                            </>
                        )}
                    </Button>
                </form>
            </div>
            <Link to="/auth/login">
                <Button variant="outline" className="mt-4">
                    Back to Login
                </Button>
            </Link>
        </div>
    );
};

export default VerifyEmail;
