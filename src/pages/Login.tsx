import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAdmin, logout } = useApp();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    if (login(password)) {
      toast({
        title: 'Welcome Admin!',
        description: 'You have successfully logged in.',
      });
      navigate('/admin');
    } else {
      toast({
        title: 'Invalid Password',
        description: 'Please check your password and try again.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully.',
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {isAdmin ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                You're Logged In
              </h1>
              <p className="text-muted-foreground mb-6">
                You have admin access to manage properties and leads.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/admin')}
                  className="w-full h-12"
                >
                  Go to Admin Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="secondary"
                  className="w-full h-12"
                >
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                  Admin Login
                </h1>
                <p className="text-muted-foreground">
                  Enter your password to access admin features
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Demo password: <code className="bg-secondary px-2 py-1 rounded">admin123</code>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
