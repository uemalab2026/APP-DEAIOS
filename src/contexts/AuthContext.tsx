import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// We map Supabase User to our expected app user format
interface AuthUser {
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'member';
  id: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check active session on load
    const initTimer = setTimeout(() => {
      setIsInitialized(true);
    }, 2000);

    const fetchUserProfile = async (session: any) => {
      try {
        const { data } = await supabase
          .from('members')
          .select('name, role')
          .eq('email', session.user.email)
          .single();

        setUser({
          email: session.user.email || '',
          name: data?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
          role: data?.role || 'member',
          id: session.user.id
        });
      } catch (err) {
        // Fallback
        setUser({
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
          role: 'member',
          id: session.user.id
        });
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(initTimer);
      if (session?.user) {
        fetchUserProfile(session).finally(() => setIsInitialized(true));
      } else {
        setIsInitialized(true);
      }
    }).catch(() => {
      clearTimeout(initTimer);
      setIsInitialized(true);
    });

    // Listen for auth changes (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  if (!isInitialized) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
