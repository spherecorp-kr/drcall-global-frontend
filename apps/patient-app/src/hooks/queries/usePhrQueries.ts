import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPhrService } from '@services';
import { queryKeys } from '@/lib/react-query';
import type { HealthRecordType, CreateHealthRecordRequest } from '@/types/phr';

const phrService = getPhrService();

/**
 * Hook to fetch latest health records for dashboard
 */
export function useLatestHealthRecords() {
  return useQuery({
    queryKey: queryKeys.phr.latest(),
    queryFn: async () => {
      const response = await phrService.getLatestRecords();
      return response.data;
    },
  });
}

/**
 * Hook to fetch health records by type
 */
export function useHealthRecordsByType(type: HealthRecordType, page = 1, limit = 20) {
  return useQuery({
    queryKey: queryKeys.phr.byType(type),
    queryFn: async () => {
      return await phrService.getRecordsByType(type, page, limit);
    },
    enabled: !!type,
  });
}

/**
 * Hook to create a new health record
 */
export function useCreateHealthRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      type,
      data,
    }: {
      type: HealthRecordType;
      data: CreateHealthRecordRequest;
    }) => {
      return await phrService.createRecord(type, data);
    },
    onSuccess: (newRecord, { type }) => {
      // Invalidate and refetch latest records
      queryClient.invalidateQueries({ queryKey: queryKeys.phr.latest() });

      // Invalidate and refetch records by type
      queryClient.invalidateQueries({ queryKey: queryKeys.phr.byType(type) });

      // Optionally, update cache optimistically
      queryClient.setQueryData(queryKeys.phr.byType(type), (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          records: [newRecord, ...(oldData.records || [])],
          total: oldData.total + 1,
        };
      });
    },
  });
}

/**
 * Hook to delete a health record
 */
export function useDeleteHealthRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, type }: { id: string; type: HealthRecordType }) => {
      await phrService.deleteRecord(id);
      return { id, type };
    },
    onSuccess: (_, { type }) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.phr.latest() });
      queryClient.invalidateQueries({ queryKey: queryKeys.phr.byType(type) });
    },
  });
}
