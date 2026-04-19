import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '../types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);

  function setUser(newUser: User) {
    user.value = newUser;
    isAuthenticated.value = true;
  }

  function logout() {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('@Helpdesk:token');
  }

  return { user, isAuthenticated, setUser, logout };
});
