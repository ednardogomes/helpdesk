import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css';

import './style.css';
import App from './App.vue';
import router from './router';

// Definindo uma paleta de cores "Premium" (Indigo) sincronizada entre Tailwind e PrimeVue
const HelpdeskPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1',
            600: '#4f46e5', // Nossa cor principal (Equivale ao bg-indigo-600 do Tailwind)
            700: '#4338ca', // Cor de Hover
            800: '#3730a3',
            900: '#312e81',
            950: '#1e1b4b'
        }
    }
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: HelpdeskPreset,
        options: {
            darkModeSelector: 'none',
        }
    }
});
app.use(ToastService);

app.mount('#app');
