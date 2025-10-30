import { QueryClient } from '@tanstack/react-query';

/**
 * React Query Configuration
 *
 * Global configuration for data fetching, caching, and synchronization
 */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: How long data is considered fresh (5 minutes)
      staleTime: 5 * 60 * 1000,

      // Cache time: How long unused data stays in cache (10 minutes)
      gcTime: 10 * 60 * 1000,

      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus in production
      refetchOnWindowFocus: import.meta.env.PROD,

      // Refetch on reconnect
      refetchOnReconnect: true,

      // Don't refetch on mount if data is still fresh
      refetchOnMount: false,

      // Error handling
      throwOnError: false,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});

/**
 * Query Keys Factory
 *
 * Centralized query key management for better cache control
 */
export const queryKeys = {
  // PHR (Personal Health Records)
  phr: {
    all: ['phr'] as const,
    latest: () => [...queryKeys.phr.all, 'latest'] as const,
    byType: (type: string) => [...queryKeys.phr.all, 'type', type] as const,
    detail: (id: string) => [...queryKeys.phr.all, 'detail', id] as const,
  },

  // Appointments
  appointments: {
    all: ['appointments'] as const,
    lists: () => [...queryKeys.appointments.all, 'list'] as const,
    list: (filters: { status?: string; page?: number }) =>
      [...queryKeys.appointments.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.appointments.all, 'detail', id] as const,
  },

  // Auth
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
} as const;
