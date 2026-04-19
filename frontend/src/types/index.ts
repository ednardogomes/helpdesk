export interface User {
  id: string;
  email: string;
  name: string;
  companyId: string;
  sectorId: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  access_token?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}
