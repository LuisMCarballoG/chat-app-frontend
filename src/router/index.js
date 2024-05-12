import {createRouter, createWebHistory} from 'vue-router';
import LoginView from '../views/LoginView.vue';
import ChatView from '../views/ChatView.vue';
import store from '../store';

const routes = [
  {path: '/', component: LoginView},
  {
    path: '/chat',
    component: ChatView,
    beforeEnter: (to, from, next) => {
      if (store.state.user.currentUser) {
        next();
      } else {
        next('/');
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
