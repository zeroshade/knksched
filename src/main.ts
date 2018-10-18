import Vue, { VNode, Component } from 'vue';
import './plugins/vuetify';
import '@mdi/font/css/materialdesignicons.css';
import moment from 'moment';
import VueMoment from 'vue-moment';
import AuthPlugin from './plugins/auth';
import App from './App.vue';
import Admin from './Admin.vue';
import Callback from './components/main/Callback.vue';

Vue.use(VueMoment, { moment });
Vue.use(AuthPlugin);

Vue.config.productionTip = false;

const routes: {[index: string]: Component} = {
  '/': App,
  '/admin': Admin,
  '/callback': Callback,
};

const MyVue = Vue.extend({
  data() {
    return {
      currentRoute: window.location.pathname,
    };
  },
  computed: {
    viewComponent(): Component {
      const matchingView = routes[this.currentRoute];
      return matchingView ? matchingView : Admin;
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
