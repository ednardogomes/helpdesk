import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/UserDashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/my-tickets',
      name: 'my-tickets',
      component: () => import('../views/MyTickets.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/ticket/new/:moduleId',
      name: 'new-ticket',
      component: () => import('../views/NewTicket.vue'),
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('@Helpdesk:token');

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

export default router;
