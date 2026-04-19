<template>
  <AppLayout>
    <div class="w-full max-w-4xl mx-auto">
      <div class="mb-8">
        <h2 class="text-4xl font-black text-white drop-shadow-lg">👤 Meu Perfil</h2>
        <p class="text-indigo-200 mt-2 text-lg">Informações da sua conta</p>
      </div>
      
      <div v-if="loading" class="bg-white rounded-xl p-8 shadow-xl border-2 border-indigo-200">
        <p class="text-indigo-600 font-semibold text-center text-lg">Carregando seus dados...</p>
      </div>
      
      <div v-else class="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-8 shadow-2xl border-2 border-indigo-300">
        <div class="grid gap-8 sm:grid-cols-2">
          <div class="p-4 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl border-l-4 border-indigo-600">
            <span class="text-indigo-600 uppercase text-xs font-black tracking-wider">📛 Nome</span>
            <p class="text-slate-800 text-2xl font-black mt-2">{{ profile?.name || '-' }}</p>
          </div>
          
          <div class="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl border-l-4 border-blue-600">
            <span class="text-blue-600 uppercase text-xs font-black tracking-wider">📧 E-mail</span>
            <p class="text-slate-800 text-xl font-bold mt-2 break-all">{{ profile?.email || '-' }}</p>
          </div>
          
          <div class="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl border-l-4 border-purple-600">
            <span class="text-purple-600 uppercase text-xs font-black tracking-wider">🎖️ Cargo / Papel</span>
            <p class="text-slate-800 text-2xl font-black mt-2">{{ profile?.role || '-' }}</p>
          </div>
          
          <div class="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl border-l-4 border-green-600">
            <span class="text-green-600 uppercase text-xs font-black tracking-wider">🏢 Empresa</span>
            <p class="text-slate-800 text-xl font-bold mt-2">{{ profile?.company?.name || '🚫 Não informado' }}</p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppLayout from '../layouts/AppLayout.vue';
import { UserService } from '../services/user.service';
import type { User } from '../types';

const profile = ref<User | null>(null);
const loading = ref(true);

const loadProfile = async () => {
  try {
    profile.value = await UserService.me();
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(loadProfile);
</script>
