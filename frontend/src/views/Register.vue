<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
    <div class="bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-2xl w-full max-w-lg border-2 border-indigo-300 p-8">
      <div class="text-center mb-10">
        <h2 class="text-4xl font-black text-indigo-900">🏢 Helpdesk</h2>
        <p class="text-slate-600 mt-3 text-lg">Crie sua conta corporativa</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="space-y-6 flex flex-col">
        <!-- Dados da Empresa -->
        <div class="bg-indigo-100 rounded-xl p-4 border-l-4 border-indigo-600">
          <h3 class="font-black text-indigo-900 uppercase text-sm tracking-wider mb-3">📋 Dados da Empresa</h3>
          
          <div class="flex flex-col gap-2 mb-4">
            <label class="text-sm font-bold text-indigo-900 uppercase">Razão Social *</label>
            <InputText 
              v-model="form.companyName" 
              type="text" 
              placeholder="Ex: Minha Empresa LTDA"
              class="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:border-indigo-600 focus:outline-none font-semibold"
              required 
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-indigo-900 uppercase">CNPJ *</label>
            <InputText 
              v-model="form.cnpj" 
              type="text" 
              placeholder="XX.XXX.XXX/0001-XX"
              class="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:border-indigo-600 focus:outline-none font-semibold"
              required 
              @input="formatCNPJ"
            />
          </div>
        </div>

        <!-- Dados do Administrador -->
        <div class="bg-blue-100 rounded-xl p-4 border-l-4 border-blue-600">
          <h3 class="font-black text-blue-900 uppercase text-sm tracking-wider mb-3">👤 Administrador Principal</h3>
          
          <div class="flex flex-col gap-2 mb-4">
            <label class="text-sm font-bold text-blue-900 uppercase">Nome Completo *</label>
            <InputText 
              v-model="form.fullName" 
              type="text" 
              placeholder="João Silva"
              class="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-600 focus:outline-none font-semibold"
              required 
            />
          </div>

          <div class="flex flex-col gap-2 mb-4">
            <label class="text-sm font-bold text-blue-900 uppercase">E-mail *</label>
            <InputText 
              v-model="form.email" 
              type="email" 
              placeholder="seu@empresa.com"
              class="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-600 focus:outline-none font-semibold"
              required 
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-blue-900 uppercase">Senha *</label>
            <Password 
              v-model="form.password" 
              placeholder="••••••••"
              :feedback="true"
              toggleMask
              class="w-full"
              inputClass="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-600 focus:outline-none font-semibold"
              required 
            />
          </div>
        </div>

        <!-- Checkbox de Termos -->
        <div class="flex items-center gap-3">
          <Checkbox v-model="form.acceptTerms" binary />
          <label class="text-sm text-slate-600 font-medium">
            Concordo com os <a href="#" class="text-indigo-600 font-bold hover:underline">Termos de Serviço</a> e <a href="#" class="text-indigo-600 font-bold hover:underline">Política de Privacidade</a>
          </label>
        </div>

        <!-- Botões -->
        <div class="flex flex-col gap-3 pt-4 border-t-2 border-indigo-200">
          <Button 
            type="submit" 
            label="✅ Registrar Empresa"
            :loading="isLoading"
            class="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black py-3 rounded-lg"
          />
          <div class="text-center">
            <span class="text-slate-600">Já tem uma conta? </span>
            <router-link to="/login" class="text-indigo-600 font-bold hover:underline">Faça login aqui</router-link>
          </div>
        </div>
      </form>

      <div v-if="errorMessage" class="mt-6 p-4 bg-red-100 border-l-4 border-red-600 rounded-lg">
        <p class="text-red-900 font-bold">❌ {{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import { api } from '../services/api';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  companyName: '',
  cnpj: '',
  fullName: '',
  email: '',
  password: '',
  acceptTerms: false,
});

const isLoading = ref(false);
const errorMessage = ref('');

const formatCNPJ = (event: any) => {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length > 14) value = value.slice(0, 14);
  
  if (value.length > 8) {
    value = value.slice(0, 2) + '.' + value.slice(2, 5) + '.' + value.slice(5, 8) + '/' + value.slice(8, 12) + '-' + value.slice(12);
  } else if (value.length > 5) {
    value = value.slice(0, 2) + '.' + value.slice(2, 5) + '.' + value.slice(5);
  } else if (value.length > 2) {
    value = value.slice(0, 2) + '.' + value.slice(2);
  }
  
  form.value.cnpj = value;
};

const handleRegister = async () => {
  if (!form.value.acceptTerms) {
    errorMessage.value = 'Você deve aceitar os termos de serviço';
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    const response = await api.post('/companies/register', {
      companyName: form.value.companyName,
      cnpj: form.value.cnpj.replace(/\D/g, ''),
      fullName: form.value.fullName,
      email: form.value.email,
      password: form.value.password,
    });

    // Fazer login automático
    const loginResponse = await api.post('/auth/login', {
      email: form.value.email,
      password: form.value.password,
    });

    const token = loginResponse.data.token || loginResponse.data.access_token;
    if (token) {
      localStorage.setItem('@Helpdesk:token', token);
    }

    authStore.setUser(loginResponse.data.user);
    router.push('/dashboard');
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erro ao registrar empresa';
  } finally {
    isLoading.value = false;
  }
};
</script>
