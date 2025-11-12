// Delivery Address Types

export interface DeliveryAddress {
  id: string;
  patientId: number;
  title: string;
  recipientName: string;
  phoneNumber: string;
  address: string;
  addressDetail?: string;
  postalCode?: string;
  googlePlaceId?: string;
  isDefault: boolean;
}

export interface CreateDeliveryAddressRequest {
  title: string;
  recipientName: string;
  phoneNumber: string;
  address: string;
  addressDetail?: string;
  postalCode?: string;
  googlePlaceId?: string;
  isDefault?: boolean;
}

export interface UpdateDeliveryAddressRequest {
  title?: string;
  recipientName?: string;
  phoneNumber?: string;
  address?: string;
  addressDetail?: string;
  postalCode?: string;
  googlePlaceId?: string;
  isDefault?: boolean;
}
