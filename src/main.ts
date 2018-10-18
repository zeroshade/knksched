import Vue, { VNode, AsyncComponent } from 'vue';
import '@/plugins/vuetify';
// import './assets/main.styl';
import moment from 'moment';
import VueMoment from 'vue-moment';
import AuthPlugin from '@/plugins/auth';

Vue.use(VueMoment, { moment });
Vue.use(AuthPlugin);

Vue.config.productionTip = false;

const routes: {[index: string]: AsyncComponent} = {
  '/': () => import('./index/App.vue'),
  '/admin': () => import('./admin/Admin.vue'),
  '/callback': () => import('@/components/Callback.vue'),
  '/privacy': () => import('./index/PrivacyPolicy.vue'),
};

const MyVue = Vue.extend({
  data() {
    return {
      currentRoute: window.location.pathname,
    };
  },
  computed: {
    viewComponent(): AsyncComponent {
      const matchingView = routes[this.currentRoute];
      return matchingView ? matchingView : () => import('./index/App.vue');
    },
  },
  render(h): VNode {
    return h(this.viewComponent);
  },
});

const app = new MyVue({}).$mount('#app');

window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname;
});
