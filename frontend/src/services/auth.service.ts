import { api } from './api';
import type { AuthResponse, LoginCredentials } from '../types';

export const AuthService = {
  /**
   * Realiza o login do usuário no backend e salva o token no LocalStorage.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Opcional: Se a API já retornar o token
    if (data.token) {
      localStorage.setItem('@Helpdesk:token', data.token);
    }
    
    return data;
  },

  /**
   * Remove os dados do usuário e limpa o token.
   */
  logout() {
    localStorage.removeItem('@Helpdesk:token');
  }
};
