import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAppointmentService } from '@services';
import { queryKeys } from '@/lib/react-query';
import type { CreateAppointmentRequest, UpdateAppointmentRequest } from '@services';

const appointmentService = getAppointmentService();

/**
 * Hook to fetch appointments with filters
 */
export function useAppointments(status?: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: queryKeys.appointments.list({ status, page }),
    queryFn: async () => {
      return await appointmentService.getAppointments(status, page, limit);
    },
  });
}

/**
 * Hook to fetch a single appointment by ID
 */
export function useAppointment(id: string) {
  return useQuery({
    queryKey: queryKeys.appointments.detail(id),
    queryFn: async () => {
      return await appointmentService.getAppointmentById(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new appointment
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAppointmentRequest) => {
      return await appointmentService.createAppointment(data);
    },
    onSuccess: () => {
      // Invalidate all appointment lists
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
    },
  });
}

/**
 * Hook to update an appointment
 */
export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAppointmentRequest }) => {
      return await appointmentService.updateAppointment(id, data);
    },
    onSuccess: (_, { id }) => {
      // Invalidate the specific appointment
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.detail(id) });

      // Invalidate all appointment lists
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
    },
  });
}

/**
 * Hook to cancel an appointment
 */
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      await appointmentService.cancelAppointment(id, reason);
      return { id };
    },
    onSuccess: (_, { id }) => {
      // Invalidate the specific appointment
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.detail(id) });

      // Invalidate all appointment lists
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
    },
  });
}
