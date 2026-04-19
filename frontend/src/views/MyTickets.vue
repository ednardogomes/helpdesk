<template>
  <AppLayout>
    <div class="w-full max-w-7xl mx-auto">
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h2 class="text-4xl font-black text-white drop-shadow-lg">🎫 Meus Chamados</h2>
          <p class="text-indigo-200 mt-2 text-lg">Acompanhe todos os seus tickets abertos</p>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-2xl overflow-hidden border-2 border-indigo-300">
        <div class="p-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black text-lg border-b-2 border-indigo-400">
          Status dos Chamados
        </div>
        
        <div class="p-6">
          <div v-if="loading" class="text-center text-indigo-600 font-bold text-lg py-8">⏳ Carregando tickets...</div>
          
          <div v-else-if="tickets.length === 0" class="text-center text-slate-600 font-semibold text-lg py-12">
            ✨ Nenhum chamado encontrado - Que tranquilidade!
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y-2 divide-indigo-200 text-left text-base">
              <thead class="bg-gradient-to-r from-indigo-100 to-blue-100">
                <tr>
                  <th class="px-6 py-4 font-black text-indigo-900 uppercase tracking-wider">🔢 ID</th>
                  <th class="px-6 py-4 font-black text-indigo-900 uppercase tracking-wider">📝 Assunto</th>
                  <th class="px-6 py-4 font-black text-indigo-900 uppercase tracking-wider">📊 Status</th>
                  <th class="px-6 py-4 font-black text-indigo-900 uppercase tracking-wider">⚡ Prioridade</th>
                  <th class="px-6 py-4 font-black text-indigo-900 uppercase tracking-wider">📅 Criado em</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-indigo-100">
                <tr v-for="ticket in tickets" :key="ticket.id" class="hover:bg-indigo-100 transition-colors duration-200 cursor-pointer">
                  <td class="px-6 py-4 text-slate-800 font-bold">{{ ticket.id }}</td>
                  <td class="px-6 py-4 text-slate-700 font-semibold">{{ ticket.subject }}</td>
                  <td class="px-6 py-4">
                    <span class="inline-block px-3 py-1 bg-blue-200 text-blue-900 rounded-full font-bold text-sm">{{ ticket.status }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span 
                      class="inline-block px-3 py-1 rounded-full font-bold text-sm"
                      :class="getPriorityClass(ticket.priority)"
                    >
                      {{ ticket.priority }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-slate-700 font-semibold">{{ formatDate(ticket.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppLayout from '../layouts/AppLayout.vue';
import { TicketService } from '../services/ticket.service';
import type { Ticket } from '../types';

const tickets = ref<Ticket[]>([]);
const loading = ref(true);

const loadTickets = async () => {
  try {
    tickets.value = await TicketService.getMyTickets();
  } catch (error) {
    console.error('Erro ao carregar tickets:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (value: string) => {
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
};

const getPriorityClass = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    'LOW': 'bg-green-200 text-green-900',
    'MEDIUM': 'bg-yellow-200 text-yellow-900',
    'HIGH': 'bg-red-200 text-red-900'
  };
  return priorityMap[priority] || 'bg-gray-200 text-gray-900';
};

onMounted(loadTickets);
</script>
