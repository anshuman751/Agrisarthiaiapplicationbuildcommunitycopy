import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Mail, Sprout, RefreshCw, CheckCircle2 } from 'lucide-react';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebase';
import { toast } from 'sonner';

export function VerifyEmail() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleCheckVerification = async () => {
    setChecking(true);
    try {
      await user?.reload();
      if (user?.emailVerified) {
        toast.success('Email verified! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        toast.error('Email not verified yet. Please check your inbox.');
      }
    } catch (error) {
      toast.error('Failed to check verification status.');
    } finally {
      setChecking(false);
    }
  };

  const handleResendEmail = async () => {
    if (!user) return;
    
    setResending(true);
    try {
      await sendEmailVerification(user);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      if (error.code === 'auth/too-many-requests') {
        toast.error('Too many requests. Please try again later.');
      } else {
        toast.error('Failed to send verification email.');
      }
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJWMzZ6TTYgMTB2Mmgydi0ySDZ6bTAgMjR2Mmgydi0ySDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
      
      <Card className="w-full max-w-md border-0 shadow-2xl relative z-10 bg-white/80 backdrop-blur-xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-amber-500 blur-2xl opacity-30 rounded-full animate-pulse"></div>
            <div className="relative flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl">
              <Mail className="h-10 w-10" />
            </div>
          </div>
          <CardTitle className="text-2xl font-black">Verify Your Email</CardTitle>
          <CardDescription className="text-sm mt-2">
            We sent a verification link to<br />
            <span className="font-bold text-gray-900">{user?.email}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Next Steps:
            </h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Check your email inbox</li>
              <li>Click the verification link</li>
              <li>Return here and click "I've Verified"</li>
            </ol>
          </div>

          <Button 
            onClick={handleCheckVerification}
            className="w-full h-11 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 font-bold"
            disabled={checking}
          >
            {checking ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "I've Verified My Email"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          <Button 
            onClick={handleResendEmail}
            variant="outline"
            className="w-full h-11"
            disabled={resending}
          >
            {resending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Resend Verification Email'
            )}
          </Button>

          <Button 
            onClick={handleLogout}
            variant="ghost"
            className="w-full h-11"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
