export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
  rating: number;
  ratingCount: number;
  sellerId: number;
  sellerName: string;
  categoryId: number;
  categoryName: string;
  images: ProductImage[];
  variants: ProductVariant[];
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: number;
  sku: string;
  attributes: VariantAttribute[];
  price?: number;
  promoPrice?: number;
  stock: number;
}

export interface VariantAttribute {
  name: string;
  value: string;
}

export interface ProductFilter {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: number;
  onPromo?: boolean;
  search?: string;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  isFirst: boolean;
  isLast: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  children?: Category[];
}

export interface ProductReview {
  id: number;
  rating: number;
  comment: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  helpful: number;
  notHelpful: number;
}

export interface FilterChangeEvent {
  filter: ProductFilter;
  page: number;
}
