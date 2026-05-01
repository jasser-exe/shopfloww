export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export interface Address {
  id: number;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface PlaceOrderRequest {
  addressId: number;
}

export interface OrderResponse {
  id: number;
  status: OrderStatus;
  totalPrice: number;
  discount?: number;
  shippingCost: number;
  finalPrice: number;
  address: Address;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  promoPrice?: number;
  variantId?: number;
  variantAttributes?: { [key: string]: string };
}
