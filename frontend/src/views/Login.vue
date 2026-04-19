<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-slate-800">Helpdesk</h2>
        <p class="text-slate-500 mt-2">Acesse sua conta corporativa</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-5 flex flex-col">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-slate-700">E-mail</label>
          <!-- Substituído para InputText do PrimeVue -->
          <InputText 
            v-model="email" 
            type="email" 
            placeholder="seu@email.com"
            class="w-full"
            required 
          />
        </div>
        
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-slate-700">Senha</label>
          <!-- Substituído para Password do PrimeVue -->
          <Password 
            v-model="password" 
            placeholder="••••••••"
            :feedback="false"
            toggleMask
            class="w-full"
            inputClass="w-full"
            required 
          />
        </div>
        
        <!-- Substituído para Button do PrimeVue com estado de loading -->
        <Button 
          type="submit" 
          label="Entrar no Sistema"
          :loading="isLoading"
          class="w-full mt-4"
        />
      </form>
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
