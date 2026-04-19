<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
    <!-- Navbar melhorada -->
    <header class="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 shadow-xl border-b-2 border-indigo-500 p-5 flex flex-col md:flex-row justify-between items-center text-white gap-4">
      <div class="flex items-center gap-6">
        <h1 class="font-black text-2xl tracking-tight">🎯 Helpdesk</h1>
        <nav class="flex gap-2">
          <Button 
            label="📊 Dashboard" 
            severity="secondary" 
            text 
            class="text-white font-semibold text-base hover:bg-indigo-500 hover:text-white transition-all duration-200 px-3 py-2 rounded-lg" 
            @click="router.push('/dashboard')"
          />
          <Button 
            label="👤 Meu Perfil" 
            severity="secondary" 
            text 
            class="text-white font-semibold text-base hover:bg-indigo-500 hover:text-white transition-all duration-200 px-3 py-2 rounded-lg" 
            @click="router.push('/profile')"
          />
          <Button 
            label="🎫 Meus Chamados" 
            severity="secondary" 
            text 
            class="text-white font-semibold text-base hover:bg-indigo-500 hover:text-white transition-all duration-200 px-3 py-2 rounded-lg" 
            @click="router.push('/my-tickets')"
          />
        </nav>
      </div>
      <Button 
        label="🚪 Sair" 
        severity="danger" 
        text 
        class="text-white font-semibold text-base hover:bg-red-600 transition-all duration-200 px-4 py-2 rounded-lg" 
        @click="handleLogout"
      />
    </header>
    
    <div class="flex-grow flex p-8">
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
