import type { PaymentStats, PaymentHistoryItem } from '@/shared/types/payment';

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
