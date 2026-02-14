import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth, FIREBASE_ENABLED } from '../firebase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isEmailVerified: boolean;
  demoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Demo user for when Firebase is not configured
interface DemoUser {
  email: string;
  uid: string;
  emailVerified: boolean;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    if (FIREBASE_ENABLED && auth) {
      // Firebase authentication
      setPersistence(auth, browserLocalPersistence).catch((error) => {
        console.error('Persistence error:', error);
      });

      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setIsEmailVerified(currentUser?.emailVerified || false);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Demo mode - check localStorage for demo user
      const storedDemoUser = localStorage.getItem('demoUser');
      if (storedDemoUser) {
        const parsedUser = JSON.parse(storedDemoUser);
        setDemoUser(parsedUser);
        setIsEmailVerified(parsedUser.emailVerified);
      }
      setLoading(false);
    }
  }, []);

  const signup = async (email: string, password: string) => {
    if (!FIREBASE_ENABLED || !auth) {
      // Demo mode signup
      if (password.length < 6) {
        toast.error('Password should be at least 6 characters.');
        throw new Error('Weak password');
      }

      // Check if user already exists in demo mode
      const existingUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
      if (existingUsers.find((u: DemoUser) => u.email === email)) {
        toast.error('This email is already registered.');
        throw new Error('Email already in use');
      }

      const newDemoUser: DemoUser = {
        email,
        uid: `demo-${Date.now()}`,
        emailVerified: true, // Auto-verify in demo mode
      };

      existingUsers.push(newDemoUser);
      localStorage.setItem('demoUsers', JSON.stringify(existingUsers));
      localStorage.setItem('demoUser', JSON.stringify(newDemoUser));
      
      setDemoUser(newDemoUser);
      setIsEmailVerified(true);
      
      toast.success('Account created successfully! (Demo Mode)', {
        description: 'Configure Firebase for real authentication',
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password should be at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address.');
      } else {
        toast.error(error.message || 'Failed to create account.');
      }
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    if (!FIREBASE_ENABLED || !auth) {
      // Demo mode login
      const existingUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
      const foundUser = existingUsers.find((u: DemoUser) => u.email === email);
      
      if (!foundUser) {
        toast.error('No account found with this email. (Demo Mode)');
        throw new Error('User not found');
      }

      localStorage.setItem('demoUser', JSON.stringify(foundUser));
      setDemoUser(foundUser);
      setIsEmailVerified(foundUser.emailVerified);
      
      toast.success('Successfully logged in! (Demo Mode)', {
        description: 'Configure Firebase for real authentication',
      });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        toast.error('Please verify your email before logging in.');
        await signOut(auth);
        throw new Error('Email not verified');
      }
      
      toast.success('Successfully logged in!');
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        toast.error('Invalid email or password.');
      } else if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password.');
      } else if (error.message !== 'Email not verified') {
        toast.error(error.message || 'Failed to login.');
      }
      throw error;
    }
  };

  const logout = async () => {
    if (!FIREBASE_ENABLED || !auth) {
      // Demo mode logout
      localStorage.removeItem('demoUser');
      setDemoUser(null);
      setIsEmailVerified(false);
      toast.success('Successfully logged out! (Demo Mode)');
      return;
    }

    try {
      await signOut(auth);
      toast.success('Successfully logged out!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout.');
      throw error;
    }
  };

  const value = {
    user: FIREBASE_ENABLED ? user : (demoUser as any),
    loading,
    signup,
    login,
    logout,
    isEmailVerified,
    demoMode: !FIREBASE_ENABLED,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}