<template>
  <AppLayout>
    <div class="w-full max-w-3xl mx-auto">
      <!-- Cabeçalho -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold text-slate-800">Abertura de Chamado</h2>
          <p class="text-slate-600 mt-1">Preencha os dados solicitados pelo setor para agilizar o seu atendimento.</p>
        </div>
        <Button label="Voltar" icon="pi pi-arrow-left" severity="secondary" text @click="router.back()" />
      </div>

      <!-- Formulário Dinâmico -->
      <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div v-if="isLoading" class="flex justify-center p-8">
          <i class="pi pi-spin pi-spinner text-4xl text-indigo-500"></i>
        </div>
        
        <form v-else @submit.prevent="submitTicket" class="space-y-6 flex flex-col">
          <div v-for="field in dynamicFields" :key="field.id" class="flex flex-col gap-2">
            <label :for="field.name" class="text-sm font-semibold text-slate-700">
              {{ field.label }} <span v-if="field.required" class="text-red-500">*</span>
            </label>
            
            <!-- Campo de Texto Simples -->
            <InputText 
              v-if="field.type === 'text'" 
              :id="field.name"
              v-model="formData[field.name]" 
              :required="field.required"
              class="w-full"
            />
            
            <!-- Campo de Texto Longo (Textarea) -->
            <Textarea 
              v-else-if="field.type === 'textarea'" 
              :id="field.name"
              v-model="formData[field.name]" 
              :required="field.required"
              rows="4"
              class="w-full"
            />
            
            <!-- Campo de Seleção (Dropdown) -->
            <Dropdown 
              v-else-if="field.type === 'select'" 
              :id="field.name"
              v-model="formData[field.name]" 
              :options="field.options" 
              placeholder="Selecione uma opção"
              class="w-full"
              :required="field.required"
            />
          </div>
          
          <div class="pt-4 border-t border-slate-100 mt-6 flex justify-end">
            <Button 
              type="submit" 
              label="Enviar Chamado" 
              icon="pi pi-check" 
              :loading="isSubmitting"
            />
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppLayout from '../layouts/AppLayout.vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';

const route = useRoute();
const router = useRouter();

const isLoading = ref(true);
const isSubmitting = ref(false);
const dynamicFields = ref<any[]>([]);
const formData = ref<Record<string, any>>({});

// Simulação de busca dos campos na API do backend baseado no ID do Módulo (Setor)
const fetchDynamicSchema = async (moduleId: string) => {
  // Simulando um pequeno delay de rede
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Exemplo Mock: Se o usuário clicou no "Helpdesk de TI" (ID 1)
  if (moduleId === '1') {
    dynamicFields.value = [
      { id: 'f1', name: 'problem_type', label: 'Tipo de Problema', type: 'select', options: ['Hardware', 'Software', 'Rede', 'Acesso'], required: true },
      { id: 'f2', name: 'asset_id', label: 'Ativo Relacionado (ID do PC, Impressora)', type: 'text', required: false },
      { id: 'f3', name: 'urgency', label: 'Urgência', type: 'select', options: ['Baixa', 'Média', 'Alta', 'Crítica'], required: true },
      { id: 'f4', name: 'error_message', label: 'Mensagem de Erro / Descrição detalhada', type: 'textarea', required: true }
    ];
  } 
  // Exemplo Mock: Se clicou no "RH" (ID 2)
  else if (moduleId === '2') {
    dynamicFields.value = [
      { id: 'f5', name: 'subject', label: 'Assunto', type: 'select', options: ['Férias', 'Benefícios', 'Ponto Eletrônico', 'Recrutamento'], required: true },
      { id: 'f6', name: 'employee_id', label: 'Matrícula do Funcionário', type: 'text', required: true },
      { id: 'f7', name: 'resolution_date', label: 'Data Desejada para Resolução', type: 'text', required: false },
    ];
  } else {
    // Default fallback
    dynamicFields.value = [
      { id: 'f10', name: 'description', label: 'Descreva detalhadamente o seu problema/solicitação', type: 'textarea', required: true }
    ];
  }
  
  isLoading.value = false;
};

const submitTicket = async () => {
  isSubmitting.value = true;
  
  // O Payload JSON perfeito que será enviado ao Backend TypeORM!
  const payload = {
    moduleId: route.params.moduleId,
    dynamicData: formData.value
  };
  
  console.log('Payload JSON Dinâmico Gerado:', payload);
  
  // Simulando requisição de post HTTP
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  alert('Chamado aberto com sucesso! Abra o Console (F12) para ver o Payload JSON criado pela renderização dinâmica.');
  isSubmitting.value = false;
  router.push('/dashboard');
};

onMounted(() => {
  const moduleId = route.params.moduleId as string;
  fetchDynamicSchema(moduleId);
});
</script>
