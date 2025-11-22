import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useDeliveryAddresses } from '../../src/features/delivery/useDeliveryAddresses';

describe('useDeliveryAddresses', () => {
    const defaultOptions = {
        selectionEnabled: true,
        labels: {
            addButtonKey: 'add',
            deleteConfirmKey: 'delete',
            maxLimitKey: 'max',
        },
        initialSelectedId: '1',
    };

    // 초기화 테스트: 기본 배송지 목록과 초기 선택 상태 확인
    it('initializes with default addresses', () => {
        const { result } = renderHook(() => useDeliveryAddresses(defaultOptions));
        
        expect(result.current.addresses.length).toBeGreaterThan(0);
        expect(result.current.selectedId).toBe('1');
        expect(result.current.ui.isAddOpen).toBe(false);
    });

    // 배송지 선택 테스트: ID로 배송지 선택 시 상태 변경 확인
    it('selects address', () => {
        const { result } = renderHook(() => useDeliveryAddresses(defaultOptions));

        act(() => {
            result.current.actions.select('2');
        });

        expect(result.current.selectedId).toBe('2');
    });

    // 추가 모달 열기 테스트: 배송지 추가 버튼 클릭 시 모달 오픈 확인
    it('opens add modal', () => {
        const { result } = renderHook(() => useDeliveryAddresses({ ...defaultOptions, maxAddresses: 10 })); // Set high max to allow add

        act(() => {
            result.current.actions.addOpen();
        });

        expect(result.current.ui.isAddOpen).toBe(true);
        expect(result.current.ui.isMaxLimitOpen).toBe(false);
    });

    // 최대 개수 제한 테스트: 최대 개수 도달 시 추가 버튼 클릭하면 제한 모달 오픈 확인
    it('shows max limit modal when full', () => {
        const { result } = renderHook(() => useDeliveryAddresses({ ...defaultOptions, maxAddresses: 0 })); // Force full

        act(() => {
            result.current.actions.addOpen();
        });

        expect(result.current.ui.isAddOpen).toBe(false);
        expect(result.current.ui.isMaxLimitOpen).toBe(true);
    });

    // 수정 모달 열기 테스트: 배송지 수정 시 해당 데이터와 함께 모달 오픈 확인
    it('opens edit modal with address data', () => {
        const { result } = renderHook(() => useDeliveryAddresses(defaultOptions));
        const targetId = result.current.addresses[0].id;

        act(() => {
            result.current.actions.edit(targetId);
        });

        expect(result.current.ui.isAddOpen).toBe(true);
        expect(result.current.ui.editingAddress).toEqual(result.current.addresses[0]);
    });

    // 삭제 프로세스 테스트: 삭제 요청 시 확인 모달 오픈 및 확인 처리
    it('handles delete flow', () => {
        const { result } = renderHook(() => useDeliveryAddresses(defaultOptions));

        // Ask delete
        act(() => {
            result.current.actions.deleteAsk('1');
        });
        expect(result.current.ui.isDeleteConfirmOpen).toBe(true);

        // Confirm delete
        act(() => {
            result.current.actions.deleteConfirm();
        });
        expect(result.current.ui.isDeleteConfirmOpen).toBe(false);
        
        // Note: Since actual delete is TODO in hook, we just check UI state reset
    });
});
