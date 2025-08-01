import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// Generic API hooks
export const useApiQuery = <T>(
  key: string[],
  endpoint: string,
  options?: {
    enabled?: boolean;
    refetchOnWindowFocus?: boolean;
    staleTime?: number;
  }
) => {
  return useQuery({
    queryKey: key,
    queryFn: async (): Promise<T> => {
      const response = await api.get(endpoint);
      return response.data;
    },
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
  });
};

export const useApiMutation = <T, V>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  options?: {
    invalidateQueries?: string[];
  }
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: V): Promise<T> => {
      const response = await api.request({
        method,
        url: endpoint,
        data,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((query) => {
          queryClient.invalidateQueries({ queryKey: [query] });
        });
      }
    },
  });
};

// Specific API hooks for your endpoints
export const useJobs = (filters?: any) => {
  const queryString = filters ? `?${new URLSearchParams(filters).toString()}` : '';
  return useApiQuery(['jobs', filters], `/jobs${queryString}`);
};

export const useJob = (id: string) => {
  return useApiQuery(['job', id], `/jobs/${id}`, {
    enabled: !!id,
  });
};

export const useUser = (id: string) => {
  return useApiQuery(['user', id], `/users/${id}`, {
    enabled: !!id,
  });
};

export const useSavedJobs = (userId: string) => {
  return useApiQuery(['savedJobs', userId], `/users/${userId}/saved-jobs`, {
    enabled: !!userId,
  });
};

export const useRecentlyViewed = (userId: string) => {
  return useApiQuery(['recentlyViewed', userId], `/users/${userId}/recently-viewed`, {
    enabled: !!userId,
  });
};

export const useCompareJobs = (userId: string) => {
  return useApiQuery(['compareJobs', userId], `/users/${userId}/compare-jobs`, {
    enabled: !!userId,
  });
};

// Mutations
export const useSaveJob = () => {
  return useApiMutation<any, { userId: string; jobId: string }>(
    '/users/save-job',
    'POST',
    { invalidateQueries: ['savedJobs'] }
  );
};

export const useRemoveSavedJob = () => {
  return useApiMutation<any, { userId: string; jobId: string }>(
    '/users/save-job',
    'DELETE',
    { invalidateQueries: ['savedJobs'] }
  );
};

export const useViewJob = () => {
  return useApiMutation<any, { userId: string; jobId: string }>(
    '/users/view-job',
    'POST',
    { invalidateQueries: ['recentlyViewed'] }
  );
};

export const useAddToCompare = () => {
  return useApiMutation<any, { userId: string; jobId: string }>(
    '/users/compare-job',
    'POST',
    { invalidateQueries: ['compareJobs'] }
  );
};

export const useRemoveFromCompare = () => {
  return useApiMutation<any, { userId: string; jobId: string }>(
    '/users/compare-job',
    'DELETE',
    { invalidateQueries: ['compareJobs'] }
  );
}; 