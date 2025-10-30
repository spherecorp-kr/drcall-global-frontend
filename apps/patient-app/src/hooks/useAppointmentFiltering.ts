import { useMemo } from 'react';
import type { AppointmentStatus } from '@appointment/pending/cards/AppointmentCard';
import type { PaymentStatus } from '@/types/completed';

type SortType = 'newest' | 'oldest';

interface Appointment {
  id: string;
  status: AppointmentStatus;
  datetime?: string;
  doctorName?: string;
  patientName?: string;
  time?: string;
  specialty?: string;
}

interface CompletedConsultation {
  id: string;
  completedAt: string;
  paymentStatus: PaymentStatus;
  doctorName?: string;
  patientName?: string;
  specialty?: string;
}

interface UseAppointmentFilteringOptions {
  appointments: Appointment[];
  completedConsultations: CompletedConsultation[];
  selectedTab: AppointmentStatus | 'completed';
  sortOrder: SortType;
  paymentStatusFilter?: PaymentStatus | 'all';
}

/**
 * Custom hook for filtering and sorting appointments
 * Extracted from complex AppointmentList component
 */
export function useAppointmentFiltering({
  appointments,
  completedConsultations,
  selectedTab,
  sortOrder,
  paymentStatusFilter = 'all',
}: UseAppointmentFilteringOptions) {
  const filteredAndSorted = useMemo(() => {
    if (selectedTab === 'completed') {
      // Filter completed consultations by payment status
      const filtered = completedConsultations.filter(
        (consultation) =>
          paymentStatusFilter === 'all' || consultation.paymentStatus === paymentStatusFilter
      );

      // Sort by completion date
      return filtered.sort((a, b) => {
        const dateA = new Date(a.completedAt.replace(/\//g, '-'));
        const dateB = new Date(b.completedAt.replace(/\//g, '-'));
        return sortOrder === 'newest'
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime();
      });
    }

    // Filter appointments by status
    const filtered = appointments.filter((apt) => apt.status === selectedTab);

    // Sort by datetime
    return filtered.sort((a, b) => {
      const dateA = a.datetime
        ? new Date(a.datetime.split(' ')[0].replace(/\//g, '-'))
        : new Date(0);
      const dateB = b.datetime
        ? new Date(b.datetime.split(' ')[0].replace(/\//g, '-'))
        : new Date(0);

      return sortOrder === 'newest'
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });
  }, [appointments, completedConsultations, selectedTab, sortOrder, paymentStatusFilter]);

  return filteredAndSorted;
}
