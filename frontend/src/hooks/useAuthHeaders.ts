import { useAuthStore } from '@/stores/authStore';

export function useAuthHeaders() {
    const { accessToken, refreshToken, setLoading } = useAuthStore();
    return {
        auth: {
            accessToken,
            refreshToken,
            onRefresh: (newAccess: string) => useAuthStore.setState({ accessToken: newAccess }),
        },
        setLoading,
    };
}


