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

    it('initializes with default addresses', () => {
        const { result } = renderHook(() => useDeliveryAddresses(defaultOptions));
        
        expect(result.current.addresses.length).toBeGreaterThan(0);
        expect(result.current.selectedId).toBe('1');
        expect(result.current.ui.isAddOpen).toBe(false);
    });

    it('selects address', () => {
        const { result } = renderHook(() => useDeliveryAddresses(defaultOptions));

        act(() => {
            result.current.actions.select('2');
        });

        expect(result.current.selectedId).toBe('2');
    });

    it('opens add modal', () => {
        const { result } = renderHook(() => useDeliveryAddresses({ ...defaultOptions, maxAddresses: 10 })); // Set high max to allow add

        act(() => {
            result.current.actions.addOpen();
        });

        expect(result.current.ui.isAddOpen).toBe(true);
        expect(result.current.ui.isMaxLimitOpen).toBe(false);
    });

    it('shows max limit modal when full', () => {
        const { result } = renderHook(() => useDeliveryAddresses({ ...defaultOptions, maxAddresses: 0 })); // Force full

        act(() => {
            result.current.actions.addOpen();
        });

        expect(result.current.ui.isAddOpen).toBe(false);
        expect(result.current.ui.isMaxLimitOpen).toBe(true);
    });

    it('opens edit modal with address data', () => {
        const { result } = renderHook(() => useDeliveryAddresses(defaultOptions));
        const targetId = result.current.addresses[0].id;

        act(() => {
            result.current.actions.edit(targetId);
        });

        expect(result.current.ui.isAddOpen).toBe(true);
        expect(result.current.ui.editingAddress).toEqual(result.current.addresses[0]);
    });

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
