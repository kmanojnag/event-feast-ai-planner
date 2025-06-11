
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cleanupAuthState, secureSignOut, secureSignIn } from '@/utils/authSecurity';
import { validateAndSanitizeRegistration } from '@/utils/validation';

interface Profile {
  id: string;
  email: string;
  name: string | null;
  role: 'customer' | 'provider' | 'organizer' | 'restaurant' | 'caterer';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
      
      // Log security event
      console.log('Profile fetched successfully:', { 
        userId, 
        timestamp: new Date().toISOString() 
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Set up auth state listener with enhanced security
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch to avoid blocking auth state change
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, role: string) => {
    try {
      // Validate and sanitize input
      const validation = validateAndSanitizeRegistration({ email, password, name, role });
      
      if (!validation.success) {
        const errorMessage = validation.errors?.join(', ') || 'Validation failed';
        toast({
          title: "Validation Error",
          description: errorMessage,
          variant: "destructive"
        });
        return { error: new Error(errorMessage) };
      }

      // Clean up auth state before signup
      cleanupAuthState();

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: validation.data!.email,
        password: validation.data!.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: validation.data!.name,
            role: validation.data!.role
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        // Log security event
        console.log('Successful sign up:', { 
          email: validation.data!.email,
          role: validation.data!.role,
          timestamp: new Date().toISOString()
        });
        
        toast({
          title: "Success!",
          description: "Please check your email to confirm your account."
        });
      }

      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await secureSignIn(email, password);
    
    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
    }

    return { error };
  };

  const signInWithGoogle = async () => {
    try {
      // Clean up auth state before Google signin
      cleanupAuthState();
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Google sign in error:', error);
      }

      return { error };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Log security event
      console.log('User signing out:', { 
        userId: user?.id,
        timestamp: new Date().toISOString()
      });
      
      await secureSignOut();
      
      toast({
        title: "Signed out successfully"
      });
    } catch (error) {
      console.error('Error signing out:', error);
      // Force redirect even if sign out fails
      window.location.href = '/auth';
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
