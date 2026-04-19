<template>
  <AppLayout>
    <Toast />
    <div class="w-full max-w-4xl mx-auto">
      <!-- Cabeçalho -->
      <div class="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-4xl font-black text-white drop-shadow-lg">🆕 Abertura de Chamado</h2>
          <p class="text-indigo-200 mt-2 text-lg">Preencha os dados solicitados para agilizar seu atendimento</p>
        </div>
        <Button label="← Voltar" icon="pi pi-arrow-left" severity="secondary" text class="font-bold hover:bg-indigo-500 transition px-3 py-2 rounded-lg text-white" @click="router.back()" />
      </div>

      <!-- Formulário Dinâmico -->
      <div class="bg-gradient-to-br from-white to-indigo-50 p-8 rounded-2xl shadow-2xl border-2 border-indigo-300">
        <div v-if="isLoading" class="flex justify-center p-12">
          <i class="pi pi-spin pi-spinner text-6xl text-indigo-600"></i>
        </div>
        
        <form v-else @submit.prevent="submitTicket" class="space-y-6 flex flex-col">
          <div v-for="field in dynamicFields" :key="field.id" class="flex flex-col gap-3">
            <label :for="field.name" class="text-base font-black text-indigo-900 uppercase tracking-wider">
              {{ field.label }} <span v-if="field.required" class="text-red-600 text-2xl">*</span>
            </label>
            
            <!-- Campo de Texto Simples -->
            <InputText 
              v-if="field.type === 'text'" 
              :id="field.name"
              v-model="formData[field.name]" 
              :required="field.required"
              class="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:border-indigo-600 focus:outline-none font-semibold"
              placeholder="Digite aqui..."
            />
            
            <!-- Campo de Texto Longo (Textarea) -->
            <Textarea 
              v-else-if="field.type === 'textarea'" 
              :id="field.name"
              v-model="formData[field.name]" 
              :required="field.required"
              rows="5"
              class="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:border-indigo-600 focus:outline-none font-semibold"
              placeholder="Descreva detalhadamente..."
            />
            
            <!-- Campo de Seleção (Dropdown) -->
            <Dropdown 
              v-else-if="field.type === 'select'" 
              :id="field.name"
              v-model="formData[field.name]" 
              :options="field.options" 
              placeholder="🔽 Selecione uma opção"
              class="w-full border-2 border-indigo-300 rounded-lg"
              :required="field.required"
            />
          </div>
          
          <div class="pt-6 border-t-2 border-indigo-200 mt-8 flex justify-end gap-4">
            <Button 
              type="button"
              label="Cancelar"
              severity="secondary"
              text
              class="font-bold px-6 py-3 hover:bg-slate-200 transition rounded-lg"
              @click="router.back()"
            />
            <Button 
              type="submit" 
              label="✅ Enviar Chamado" 
              icon="pi pi-check" 
              :loading="isSubmitting"
              class="font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3"
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
import { api } from '../services/api';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const route = useRoute();
const router = useRouter();
const toast = useToast();

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
  
  try {
    // Construct the payload for the backend
    const moduleId = parseInt(route.params.moduleId as string);
    
    // Find the description field (textarea)
    const descriptionField = dynamicFields.value.find(field => field.type === 'textarea');
    const description = descriptionField ? formData.value[descriptionField.name] : 'No description provided';
    
    // Find subject (first select or text field)
    const subjectField = dynamicFields.value.find(field => field.type === 'select' || field.type === 'text');
    const subject = subjectField ? formData.value[subjectField.name] : 'New Ticket';
    
    const payload = {
      module_id: moduleId,
      subject: subject || 'New Ticket',
      description: description || 'No description',
      priority: 'MEDIUM' // Default priority
    };
    
    await api.post('/tickets', payload);
    
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Chamado criado com sucesso!',
      life: 3000
    });
    
    router.push('/dashboard');
  } catch (error: any) {
    console.error('Error creating ticket:', error);
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.response?.data?.message || 'Erro ao criar chamado',
      life: 5000
    });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  const moduleId = route.params.moduleId as string;
  fetchDynamicSchema(moduleId);
});
</script>
