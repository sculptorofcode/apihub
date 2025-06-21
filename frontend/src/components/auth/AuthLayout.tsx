import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Separator } from '../../components/ui/separator';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: ReactNode;
  image?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  image = '/placeholder.svg',
  title,
  subtitle,
  className,
}) => {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      {/* Left side - Form */}
      <motion.div
        className={cn(
          "flex flex-col justify-center items-center p-8",
          className
        )}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md space-y-6">
          <motion.div
            className="space-y-2 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">{title}</h1>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </motion.div>

          <Separator className="my-6" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Image */}
      <motion.div
        className="hidden md:flex flex-col items-center justify-center bg-muted relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-pattern">
          <img
            src={image}
            alt="Authentication background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-background/70"></div>
        </div>
        <motion.div
          className="relative z-10 max-w-lg px-6 py-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="rounded-xl bg-background/80 backdrop-blur-lg shadow-2xl p-8 text-center border border-primary/10">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-primary mb-2">IdeaHub</h2>
            <p className="text-muted-foreground">Connect, share, and build relationships in a seamless digital experience.</p>
          </div>
        </motion.div>

        {/* Floating elements for visual interest */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-primary/10 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-16 h-16 rounded-full bg-primary/20 animate-float-delay"></div>
        <div className="absolute top-2/3 left-1/3 w-12 h-12 rounded-full bg-primary/15 animate-float-slow"></div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
