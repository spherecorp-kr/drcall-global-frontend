export type PaymentTab = 'history' | 'settlement' | 'report';

export interface PaymentStats {
	totalBilled: number;
	totalCompleted: number;
	totalPending: number;
	asOfDate: string;
}

export interface PaymentHistoryItem {
	paymentNumber: string;
	appointmentNumber: string;
	paymentRequestDatetime: string;
	paymentDatetime: string;
	paymentStatus: 'completed' | 'pending';
	paymentMethod: 'QR' | 'card' | 'bank_transfer';
	totalAmount: number;
	consultationFee: number;
	prescriptionFee: number;
	serviceFee: number;
	deliveryFee: number;
}
