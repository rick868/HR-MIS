import { useAuthStore } from '@/stores/authStore';

export function useAuthHeaders() {
    const { accessToken, refreshToken } = useAuthStore();
    return {
        auth: {
            accessToken,
            refreshToken,
            onRefresh: (newAccess: string, newRefresh?: string) => useAuthStore.setState((s) => ({ accessToken: newAccess, refreshToken: newRefresh ?? s.refreshToken })),
        },
    };
}


