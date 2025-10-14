import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Mock credentials for demonstration
const MOCK_CREDENTIALS = {
  email: 'admin@company.com',
  password: 'password123',
  user: {
    id: '1',
    email: 'admin@company.com',
    name: 'Admin User',
    role: 'Administrator'
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true });

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check credentials
        if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
          set({ user: MOCK_CREDENTIALS.user, isLoading: false });
          return true;
        }

        set({ isLoading: false });
        return false;
      },

      logout: () => {
        set({ user: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'hr-auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
