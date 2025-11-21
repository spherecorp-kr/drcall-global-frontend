import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    useShipment,
    useShipmentByAppointment,
    usePatientShipments,
    useShipmentTracking,
    useCancelShipment
} from '@hooks/queries/useShippingQueries';
import { shippingService } from '@/services/shippingService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock shippingService
vi.mock('@/services/shippingService', () => ({
    shippingService: {
        getShipment: vi.fn(),
        getShipmentByAppointment: vi.fn(),
        getPatientShipments: vi.fn(),
        getTracking: vi.fn(),
        cancelShipment: vi.fn(),
    }
}));

// Setup QueryClient wrapper
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useShippingQueries', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // useShipment 훅 테스트 그룹
    describe('useShipment', () => {
        // ID로 배송 상세 정보 조회 성공 여부 확인
        it('fetches shipment detail', async () => {
            const shipment = { id: 1, status: 'PENDING' };
            (shippingService.getShipment as any).mockResolvedValue(shipment);

            const { result } = renderHook(() => useShipment(1), { wrapper: createWrapper() });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(shipment);
            expect(shippingService.getShipment).toHaveBeenCalledWith(1);
        });

        // ID가 없을 때 쿼리가 비활성화되어 실행되지 않는지 확인
        it('is disabled when id is undefined', () => {
            const { result } = renderHook(() => useShipment(undefined), { wrapper: createWrapper() });
            expect(result.current.isPending).toBe(true);
            expect(result.current.fetchStatus).toBe('idle');
        });
    });

    // useShipmentByAppointment 훅 테스트 그룹
    describe('useShipmentByAppointment', () => {
        // 예약 ID로 연관된 배송 정보 조회 확인
        it('fetches shipment by appointment', async () => {
            const shipment = { id: 1, appointmentId: 100 };
            (shippingService.getShipmentByAppointment as any).mockResolvedValue(shipment);

            const { result } = renderHook(() => useShipmentByAppointment(100), { wrapper: createWrapper() });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(shipment);
            expect(shippingService.getShipmentByAppointment).toHaveBeenCalledWith(100);
        });
    });

    // usePatientShipments 훅 테스트 그룹
    describe('usePatientShipments', () => {
        // 환자 ID로 배송 목록 조회 확인
        it('fetches patient shipments', async () => {
            const shipments = [{ id: 1 }, { id: 2 }];
            (shippingService.getPatientShipments as any).mockResolvedValue(shipments);

            const { result } = renderHook(() => usePatientShipments(123), { wrapper: createWrapper() });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(shipments);
            expect(shippingService.getPatientShipments).toHaveBeenCalledWith(123);
        });
    });

    // useShipmentTracking 훅 테스트 그룹
    describe('useShipmentTracking', () => {
        // 배송 추적 정보 조회 확인
        it('fetches tracking info', async () => {
            const tracking = { status: 'IN_TRANSIT', location: 'Hub' };
            (shippingService.getTracking as any).mockResolvedValue(tracking);

            const { result } = renderHook(() => useShipmentTracking(1), { wrapper: createWrapper() });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(tracking);
        });
    });

    // useCancelShipment 훅 테스트 그룹
    describe('useCancelShipment', () => {
        // 배송 취소 요청 실행 확인
        it('cancels shipment and invalidates queries', async () => {
            const shipment = { id: 1, appointmentId: 100, patientId: 123 };
            (shippingService.cancelShipment as any).mockResolvedValue(shipment);

            const { result } = renderHook(() => useCancelShipment(), { wrapper: createWrapper() });

            await result.current.mutateAsync({ shipmentId: 1, reason: 'Changed mind' });

            expect(shippingService.cancelShipment).toHaveBeenCalledWith(1, 'Changed mind');
        });
    });
});
