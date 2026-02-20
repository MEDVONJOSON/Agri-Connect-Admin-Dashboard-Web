import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, User } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string, role?: User['role']) => Promise<boolean>;
  signup: (data: User) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  upgradeSubscription: (tier: User['subscriptionTier']) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await auth.getUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (
    email: string,
    password?: string,
    role?: User['role']
  ): Promise<boolean> => {
    const success = await auth.login(email, password, role);
    if (success) {
      await loadUser();
    }
    return success;
  };

  const handleSignup = async (data: User): Promise<boolean> => {
    const success = await auth.signup(data);
    if (success) {
      await loadUser();
    }
    return success;
  };

  const handleLogout = async (): Promise<void> => {
    await auth.logout();
    setUser(null);
  };

  const handleUpdateProfile = async (updates: Partial<User>): Promise<boolean> => {
    const success = await auth.updateProfile(updates);
    if (success) {
      await loadUser();
    }
    return success;
  };

  const handleUpgradeSubscription = async (tier: User['subscriptionTier']): Promise<boolean> => {
    const success = await auth.upgradeSubscription(tier);
    if (success) {
      await loadUser();
    }
    return success;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
        updateProfile: handleUpdateProfile,
        isAuthenticated: !!user && user.email !== 'guest@agriconnect.sl',
        upgradeSubscription: handleUpgradeSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
