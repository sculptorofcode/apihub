
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-[var(--background-50)] dark:bg-[var(--background-900)] py-8">
      <div className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-3">
              Product
            </h3>
            <div className="space-y-2">
              <Link to="/features" className="block text-muted-foreground hover:text-primary">
                Features
              </Link>
              <Link to="/pricing" className="block text-muted-foreground hover:text-primary">
                Pricing
              </Link>
              <Link to="/api" className="block text-muted-foreground hover:text-primary">
                API
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-3">
              Community
            </h3>
            <div className="space-y-2">
              <Link to="/guidelines" className="block text-muted-foreground hover:text-primary">
                Guidelines
              </Link>
              <Link to="/support" className="block text-muted-foreground hover:text-primary">
                Support
              </Link>
              <Link to="/feedback" className="block text-muted-foreground hover:text-primary">
                Feedback
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-3">
              Company
            </h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-muted-foreground hover:text-primary">
                About
              </Link>
              <Link to="/careers" className="block text-muted-foreground hover:text-primary">
                Careers
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-900)] dark:text-[var(--text-50)] mb-3">
              Legal
            </h3>
            <div className="space-y-2">
              <Link to="/privacy" className="block text-muted-foreground hover:text-primary">
                Privacy
              </Link>
              <Link to="/terms" className="block text-muted-foreground hover:text-primary">
                Terms
              </Link>
              <Link to="/cookies" className="block text-muted-foreground hover:text-primary">
                Cookies
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; 2024 IdeaHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
