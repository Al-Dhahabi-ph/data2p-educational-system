import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check password
    if (password === 'PharmaX@2025!') {
      onLogin();
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/movie-and-series-b78d0.appspot.com/o/files%2FIMG_20250915_023025.png?alt=media&token=fa4e5540-463f-41c3-85c0-2831bd8258c6";

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-l-4 border-l-[#1E94D4]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={logoUrl} 
              alt="Data2P Logo" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-[#153864]">
            Admin Access
          </CardTitle>
          <p className="text-gray-600">Enter admin password to continue</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#1E94D4] hover:bg-[#153864] text-white"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
