<template>
  <AppLayout>
    <div class="w-full max-w-6xl mx-auto">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-slate-800">Meus Helpdesks</h2>
        <p class="text-slate-600 mt-2">
          Selecione o departamento para o qual deseja abrir um chamado.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Cards dos Módulos (Renderização Mockada) -->
        <Card 
          v-for="module in helpdeskModules" 
          :key="module.id" 
          @click="router.push('/ticket/new/' + module.id)"
          class="shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border border-slate-100"
        >
          <template #title>
            <div class="flex items-center gap-3">
              <i :class="module.icon" class="text-2xl text-indigo-600"></i>
              <span class="text-xl font-bold text-slate-700">{{ module.name }}</span>
            </div>
          </template>
          
          <template #content>
            <p class="text-slate-500 leading-relaxed min-h-[60px]">
              {{ module.description }}
            </p>
          </template>
          
          <template #footer>
            <Button 
              label="Abrir Chamado" 
              icon="pi pi-arrow-right" 
              iconPos="right"
              class="w-full mt-2" 
              outlined 
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
