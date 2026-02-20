import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'agri_user_session';
const TOKEN_KEY = 'agri_auth_tokens';
const DB_KEY = 'agri_users_db';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: 'farmer' | 'buyer' | 'logistics' | 'admin' | 'super_admin' | 'data_admin' | 'agri_expert' | 'support_admin';
  location?: string;
  profileImage?: string;
  memberSince?: string;
  rating?: number;
  harvests?: number;
  digitalId?: string;
  isVerifiedBuyer?: boolean;
  procurementStats?: {
    totalSourced: string;
    paymentRating: number;
    activeBids: number;
  };
  buyingInterests?: string[];
  farmDetails?: {
    name: string;
    size: string;
    location: string;
    crops: string[];
  };
  subscriptionTier?: 'FREE' | 'PRO_FARMER' | 'PRO_INVESTOR' | 'PRO_BUYER';
  businessName?: string;
  businessType?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Timestamp when access token expires
}

// Mock database to store users across sessions (in AsyncStorage)
async function getMockDb(): Promise<Record<string, User>> {
  try {
    const db = await AsyncStorage.getItem(DB_KEY);
    return db ? JSON.parse(db) : {};
  } catch {
    return {};
  }
}

async function saveToMockDb(user: User): Promise<void> {
  try {
    const db = await getMockDb();
    // Use phone as the key since it's the primary login method now
    db[user.phone] = user;
    await AsyncStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (error) {
    console.error('Error saving to mock DB:', error);
  }
}

async function getFromMockDb(phone: string): Promise<User | null> {
  try {
    const db = await getMockDb();
    return db[phone] || null;
  } catch {
    return null;
  }
}

// Helper to generate mock tokens
function generateMockTokens(userId: string): AuthTokens {
  return {
    accessToken: `mock_access_token_${userId}_${Date.now()}`,
    refreshToken: `mock_refresh_token_${userId}_${Date.now()}`,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
  };
}

export const auth = {
  login: async (
    phone: string,
    password?: string,
    role: User['role'] = 'farmer'
  ): Promise<boolean> => {
    try {
      // Backend verification simulation
      let user = await getFromMockDb(phone);

      if (!user) {
        // Fallback for demo login without signup
        user = {
          id: `user_${Date.now()}`,
          name: `User ${phone.slice(-4)}`,
          phone: phone,
          role: role,
          memberSince: new Date().getFullYear().toString(),
          rating: 4.8,
          harvests: 14,
          digitalId: `AGC-${role === 'farmer' ? 'FM' : 'BY'}-${Math.floor(1000 + Math.random() * 9000)}`,
          location: 'Sierra Leone',
          profileImage: 'https://images.unsplash.com/photo-1595113333347-97507eb8b387?q=80&w=200&auto=format&fit=crop',
          farmDetails: role === 'farmer' ? {
            name: 'Green Valley Farm',
            size: '5 Acres',
            location: 'Bo District',
            crops: ['Rice', 'Cassava'],
          } : undefined,
          procurementStats: role === 'buyer' ? {
            totalSourced: '0 Tons',
            paymentRating: 5.0,
            activeBids: 0,
          } : undefined,
          buyingInterests: role === 'buyer' ? ['Rice', 'Vegetables'] : undefined,
          isVerifiedBuyer: role === 'buyer' ? true : undefined,
        };
        await saveToMockDb(user);
      } else if (user.role !== role) {
        // Update role if logging in with different role for demo purposes
        user.role = role;
        await saveToMockDb(user);
      }

      // Generate tokens
      const tokens = generateMockTokens(user.id);

      // Store securely (Mocking secure storage with AsyncStorage for now)
      await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  signup: async (data: User): Promise<boolean> => {
    try {
      // Ensure ID exists
      if (!data.id) {
        data.id = `user_${Date.now()}`;
      }

      await saveToMockDb(data);

      // Auto login after signup
      const tokens = generateMockTokens(data.id);
      await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getUser: async (): Promise<User | null> => {
    try {
      const userStr = await AsyncStorage.getItem(STORAGE_KEY);
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch {
      return null;
    }
  },

  getTokens: async (): Promise<AuthTokens | null> => {
    try {
      const tokenStr = await AsyncStorage.getItem(TOKEN_KEY);
      return tokenStr ? JSON.parse(tokenStr) : null;
    } catch {
      return null;
    }
  },

  refreshToken: async (): Promise<string | null> => {
    try {
      const tokens = await auth.getTokens();
      if (!tokens || !tokens.refreshToken) return null;

      // Simulate API call to refresh token
      // In a real app, you would send the refreshToken to the backend

      const newTokens: AuthTokens = {
        ...tokens,
        accessToken: `mock_access_token_refreshed_${Date.now()}`,
        expiresAt: Date.now() + 15 * 60 * 1000,
      };

      await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(newTokens));
      return newTokens.accessToken;
    } catch (error) {
      console.error('Refresh token error:', error);
      return null;
    }
  },

  updateProfile: async (updates: Partial<User>): Promise<boolean> => {
    try {
      const user = await auth.getUser();
      if (!user) return false;
      const updatedUser = { ...user, ...updates };
      await saveToMockDb(updatedUser);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      const tokens = await auth.getTokens();
      // Check if we have a valid access token or at least a refresh token
      return !!tokens;
    } catch {
      return false;
    }
  },

  upgradeSubscription: async (tier: User['subscriptionTier']): Promise<boolean> => {
    try {
      const user = await auth.getUser();
      if (!user) return false;

      const updatedUser = { ...user, subscriptionTier: tier };
      await saveToMockDb(updatedUser);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Upgrade subscription error:', error);
      return false;
    }
  }
};
