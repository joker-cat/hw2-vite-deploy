import { createRouter, createWebHashHistory } from 'vue-router';
import admin from '../views/admin.vue';
import index from '../views/Index.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: index
    },
    {
      path: '/admin',
      component: admin
    }
  ]
})

router.afterEach((to, from) => {
  if (to.path === '/admin' && (!document.cookie.includes('mycookieTest'))) {
    router.push('/');
  }
});

export default router
