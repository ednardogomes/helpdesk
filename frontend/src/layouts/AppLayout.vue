<template>
  <div class="min-h-screen bg-slate-100 flex flex-col">
    <!-- Navbar simples -->
    <header class="bg-indigo-600 shadow-md p-4 flex justify-between items-center text-white">
      <h1 class="font-bold text-lg">Helpdesk Workspace</h1>
      <!-- Substituído para Button do PrimeVue -->
      <Button 
        label="Sair" 
        severity="secondary" 
        text 
        class="text-white hover:bg-indigo-700 transition" 
        @click="handleLogout"
      />
    </header>
    
    <div class="flex-grow flex p-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
