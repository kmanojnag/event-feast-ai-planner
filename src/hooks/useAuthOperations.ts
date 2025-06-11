
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cleanupAuthState, secureSignOut, secureSignIn } from '@/utils/authSecurity';
import { validateAndSanitizeRegistration } from '@/utils/validation';

export const useAuthOperations = () => {
  const { toast } = useToast();

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

  const signOut = async (user: any) => {
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

  return {
    signUp,
    signIn,
    signInWithGoogle,
    signOut
  };
};
