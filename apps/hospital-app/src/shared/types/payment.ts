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

// Settlement Types
export type SettlementStatus = 'completed' | 'scheduled' | 'pending' | 'confirmed' | 'onHold';

export interface SettlementStats {
	expectedAmount: number;
	completedAmount: number;
	deliveryUsageAmount: number;
	deliveryFeeCompletedAmount: number;
	asOfDate: string;
}

export interface SettlementHistoryItem {
	settlementId: string;
	settlementPeriod: string;
	expectedAmount: number;
	completedAmount: number;
	status: SettlementStatus;
	completedDatetime?: string;
}

export interface DeliveryFeeItem {
	deliveryId: string;
	settlementPeriod: string;
	deliveryUsageAmount: number;
	status: SettlementStatus;
	paymentCompletedDate?: string;
}

// Sales Report Types
export interface SalesReportStats {
	totalSales: number;
	paymentCount: number;
	averagePayment: number;
	dateRange: string;
}

export interface SalesChartData {
	date: string;
	amount: number;
}

export interface PaymentMethodData {
	name: string;
	value: number;
	percentage: number;
	color: string;
}

export interface SalesItemData {
	name: string;
	value: number;
	percentage: number;
	color: string;
}
