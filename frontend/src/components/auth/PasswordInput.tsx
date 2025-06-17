import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ className, error, size, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <div className="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    className={cn(
                        "pr-10",
                        error && "border-red-500",
                        className
                    )}
                    {...props}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-min px-3 py-2 hover:bg-transparent active:bg-transparent focus:bg-transparent focus:ring-0"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                    </span>
                </Button>
            </div>
            {error && (
                <p className="text-sm font-medium text-red-500 mt-1">{error}</p>
            )}
        </>
    );
};

export default PasswordInput;
