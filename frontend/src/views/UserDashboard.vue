<template>
  <AppLayout>
    <div class="w-full max-w-7xl mx-auto">
      <div class="mb-10">
        <h2 class="text-4xl font-black text-white drop-shadow-lg">Meus Helpdesks</h2>
        <p class="text-indigo-200 mt-3 text-lg font-medium">
          Selecione o departamento para abrir um novo chamado
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Cards dos Módulos -->
        <Card 
          v-for="module in helpdeskModules" 
          :key="module.id" 
          @click="router.push('/ticket/new/' + module.id)"
          class="shadow-xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer border-2 border-indigo-300 bg-gradient-to-br from-white to-indigo-50 rounded-xl overflow-hidden"
        >
          <template #title>
            <div class="flex items-center gap-3 mb-2">
              <i :class="module.icon" class="text-4xl text-indigo-600"></i>
              <span class="text-2xl font-black text-indigo-900">{{ module.name }}</span>
            </div>
          </template>
          
          <template #content>
            <p class="text-slate-600 leading-relaxed min-h-[60px] font-medium">
              {{ module.description }}
            </p>
          </template>
          
          <template #footer>
            <Button 
              label="🚀 Abrir Chamado" 
              icon="pi pi-arrow-right" 
              iconPos="right"
              class="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold" 
            />
          </template>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '../layouts/AppLayout.vue';
import Card from 'primevue/card';
import Button from 'primevue/button';

const router = useRouter();

// Mock de dados temporário (Futuramente virá da API baseado na Empresa logada)
const helpdeskModules = ref([
  { 
    id: 1, 
    name: 'T.I. e Sistemas', 
    description: 'Suporte para computadores, softwares, rede e acessos do sistema.', 
    icon: 'pi pi-desktop' 
  },
  { 
    id: 2, 
    name: 'Recursos Humanos', 
    description: 'Férias, folha de pagamento, benefícios e dúvidas sobre ponto.', 
    icon: 'pi pi-users' 
  },
  { 
    id: 3, 
    name: 'Manutenção Predial', 
    description: 'Avisos sobre problemas na infraestrutura, elétrica ou hidráulica.', 
    icon: 'pi pi-wrench' 
  }
]);
</script>
