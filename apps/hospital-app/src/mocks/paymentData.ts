import type { PaymentStats, PaymentHistoryItem, SettlementStats, SettlementHistoryItem, DeliveryFeeItem, SettlementStatus } from '@/shared/types/payment';

export const mockPaymentStats: PaymentStats = {
	totalBilled: 1234567,
	totalCompleted: 987654,
	totalPending: 246913,
	asOfDate: '2025.10.28',
};

export const mockPaymentHistory: PaymentHistoryItem[] = Array.from({ length: 480 }, (_, i) => {
	const consultationFee = Math.floor(Math.random() * 50000) + 20000;
	const prescriptionFee = Math.random() > 0.3 ? Math.floor(Math.random() * 30000) + 10000 : 0;
	const serviceFee = Math.floor(Math.random() * 10000) + 5000;
	const deliveryFee = prescriptionFee > 0 && Math.random() > 0.5 ? Math.floor(Math.random() * 5000) + 2000 : 0;

	const requestDate = new Date(2025, 8, 30, 14, 30, 0); // 2025-09-30 14:30:00
	const paymentDate = new Date(2025, 8, 30, 16, 44, 51); // 2025-09-30 16:44:51

	return {
		paymentNumber: `P${String(i + 1).padStart(6, '0')}`,
		appointmentNumber: `A${String(i + 1).padStart(6, '0')}`,
		paymentRequestDatetime: requestDate.toISOString(),
		paymentDatetime: paymentDate.toISOString(),
		paymentStatus: Math.random() > 0.2 ? 'completed' : 'pending',
		paymentMethod: ['QR', 'card', 'bank_transfer'][Math.floor(Math.random() * 3)] as 'QR' | 'card' | 'bank_transfer',
		totalAmount: consultationFee + prescriptionFee + serviceFee + deliveryFee,
		consultationFee,
		prescriptionFee,
		serviceFee,
		deliveryFee,
	};
});

export const mockSettlementStats: SettlementStats = {
	expectedAmount: 52000000,
	completedAmount: 40000000,
	deliveryUsageAmount: 32000000,
	deliveryFeeCompletedAmount: 12000000,
	asOfDate: '2025.10.28',
};

const settlementStatuses: SettlementStatus[] = ['completed', 'scheduled', 'onHold', 'confirmed'];

export const mockSettlementHistory: SettlementHistoryItem[] = Array.from({ length: 124 }, (_, i) => {
	const status = settlementStatuses[Math.floor(Math.random() * settlementStatuses.length)];
	const hasCompletedDate = status === 'completed' || status === 'confirmed';

	return {
		settlementId: `20250905-${String(325 + i).padStart(3, '0')}`,
		settlementPeriod: '30/08/2025~ 04/082025',
		expectedAmount: Math.floor(Math.random() * 40000) + 2000,
		completedAmount: Math.floor(Math.random() * 5000) + 800,
		status,
		completedDatetime: hasCompletedDate ? new Date(2025, 8, 30, 16, 44, 51).toISOString() : undefined,
	};
});

const deliveryStatuses: SettlementStatus[] = ['completed', 'scheduled'];

export const mockDeliveryFeeHistory: DeliveryFeeItem[] = Array.from({ length: 111 }, (_, i) => {
	const status = deliveryStatuses[Math.floor(Math.random() * deliveryStatuses.length)];
	const hasPaymentDate = status === 'completed';

	return {
		deliveryId: `20250905-${String(325 + i).padStart(3, '0')}`,
		settlementPeriod: '30/08/2025~ 04/082025',
		deliveryUsageAmount: Math.floor(Math.random() * 5000) + 800,
		status,
		paymentCompletedDate: hasPaymentDate ? new Date(2023, 4, 16, 16, 27, 0).toISOString() : undefined,
	};
});
