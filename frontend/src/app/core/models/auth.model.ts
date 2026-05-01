export interface UserPayload {
  sub: string;
  email: string;
  role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
  iat: number;
  exp: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userResponse?: UserResponse;
}

export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
  createdAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AppError {
  status: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
  fieldErrors?: { [key: string]: string };
}

