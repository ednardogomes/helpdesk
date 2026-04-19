export interface Company {
  id: number;
  name: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  company_id?: number | null;
  company?: Company | null;
}

export interface Ticket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
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
