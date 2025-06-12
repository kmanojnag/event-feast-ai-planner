
export interface Profile {
  id: string;
  email: string;
  name: string | null;
  role: 'customer'| 'provider'  | 'organizer' | 'restaurant' | 'caterer' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: any;
  session: any;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: any }>;
}
