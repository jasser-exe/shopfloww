import { OrderStatus } from './order.model';

export interface AdminDashboardResponse {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  topProduct: {
    id: number;
    name: string;
    revenue: number;
  };
  recentOrders: OrderSummary[];
  userStats: {
    active: number;
    inactive: number;
    newThisMonth: number;
  };
}

export interface SellerDashboardResponse {
  totalRevenue: number;
  pendingOrdersCount: number;
  lowStockProducts: ProductStockAlert[];
  recentOrders: OrderSummary[];
  productsCount: number;
  activeProductsCount: number;
}

export interface CustomerDashboardResponse {
  activeOrders: OrderSummary[];
  recentReviews: ReviewSummary[];
  totalOrders: number;
  totalSpent: number;
}

export interface OrderSummary {
  id: number;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  customerName?: string;
  productCount: number;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
}

export interface ProductStockAlert {
  id: number;
  name: string;
  stock: number;
  threshold: number;
}

export interface ReviewSummary {
  id: number;
  productName: string;
  rating: number;
  comment: string;
  createdAt: string;
  approved: boolean;
}

export interface Coupon {
  id: number;
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
  expiryDate: string;
  maxUsages: number;
  currentUsages: number;
  active: boolean;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
  active: boolean;
  createdAt: string;
}
