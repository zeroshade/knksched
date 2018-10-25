import Vue, { VNode, AsyncComponent } from 'vue';
import VueRouter from 'vue-router';
import moment from 'moment';
import VueMoment from 'vue-moment';
import AuthPlugin from '@/plugins/auth';
import '@/plugins/vuetify';
import Main from './App.vue';

const Layout = () => import('./index/Layout.vue');
const Admin = () => import('./admin/Admin.vue');
const Callback = () => import('@/components/Callback.vue');

const Privacy = () => import('./index/components/Privacy.vue');
const RoomGrid = () => import('./index/components/RoomGrid.vue');
const Agenda = () => import('./index/components/Agenda.vue');
const ByEvent = () => import('./index/components/ByEvent.vue');

Vue.use(VueMoment, { moment });
Vue.use(AuthPlugin);
Vue.use(VueRouter);

Vue.config.productionTip = false;

const routes = [
  {
    path: '/', component: Layout,
    children: [
      { path: '', redirect: '/rooms' },
      { path: 'rooms', component: RoomGrid },
      { path: 'agenda', component: Agenda },
      { path: 'events', component: ByEvent },
      { path: 'privacy', component: Privacy },
    ],
  },
  { path: '/admin', component: Admin },
  { path: '/callback', component: Callback },
];

const router = new VueRouter({ mode: 'history', routes });

const app = new Vue({
  router,
  render: (h) => h(Main),
}).$mount('#app');
