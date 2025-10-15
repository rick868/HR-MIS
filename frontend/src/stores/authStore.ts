import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,

      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true });

        try {
          const response = await fetch(`${API_BASE_URL}/auth/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            set({ isLoading: false });
            return false;
          }

          const data = await response.json();
          const accessToken = data.access as string;
          const refreshToken = data.refresh as string;

          // get current user
          const meResp = await fetch(`${API_BASE_URL}/users/me/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (!meResp.ok) {
            set({ isLoading: false });
            return false;
          }
          const me = await meResp.json();

          set({ user: me, accessToken, refreshToken, isLoading: false });
          return true;
        } catch (e) {
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'hr-auth-storage',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, refreshToken: state.refreshToken }),
    }
  )
);
