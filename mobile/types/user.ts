export interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
  state?: string;
  country?: string;
  approximateArea: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  location?: UserLocation;
  isVerified: boolean;
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
}
