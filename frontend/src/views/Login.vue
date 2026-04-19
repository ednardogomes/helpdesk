<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
    <div class="bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-2xl w-full max-w-md border-2 border-indigo-300 p-8">
      <div class="text-center mb-10">
        <h2 class="text-4xl font-black text-indigo-900">🎯 Helpdesk</h2>
        <p class="text-slate-600 mt-3 text-lg">Acesse sua conta corporativa</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6 flex flex-col">
        <div class="flex flex-col gap-3">
          <label class="text-sm font-bold text-indigo-900 uppercase">📧 E-mail</label>
          <InputText 
            v-model="email" 
            type="email" 
            placeholder="seu@empresa.com"
            class="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:border-indigo-600 focus:outline-none font-semibold"
            required 
          />
        </div>
        
        <div class="flex flex-col gap-3">
          <label class="text-sm font-bold text-indigo-900 uppercase">🔐 Senha</label>
          <Password 
            v-model="password" 
            placeholder="••••••••"
            :feedback="false"
            toggleMask
            class="w-full"
            inputClass="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:border-indigo-600 focus:outline-none font-semibold"
            required 
          />
        </div>
        
        <Button 
          type="submit" 
          label="✅ Entrar no Sistema"
          :loading="isLoading"
          class="w-full mt-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black py-3"
        />
      </form>

      <!-- Link para registro -->
      <div class="mt-8 pt-8 border-t-2 border-indigo-200 text-center">
        <p class="text-slate-600 mb-3 font-medium">Não tem uma conta?</p>
        <router-link to="/register" class="text-indigo-600 font-black text-lg hover:underline">📝 Registre sua empresa</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';
import { AuthService } from '../services/auth.service';

// Importação individual dos componentes do PrimeVue
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    isLoading.value = true;
    
    const response = await AuthService.login({
      email: email.value,
      password: password.value
    });
    
    // Atualiza o estado global (Pinia)
    authStore.setUser(response.user);
    
    // Redireciona o usuário (A rota /dashboard será criada nos próximos passos)
    router.push('/dashboard');
    
  } catch (error) {
    console.error('Falha na autenticação:', error);
    // TODO: Adicionar um Toast do PrimeVue futuramente para exibir o erro
    alert('E-mail ou senha incorretos.');
  } finally {
    isLoading.value = false;
  }
};
</script>
