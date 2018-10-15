import Vue, { VNode, Component } from 'vue';
import App from './App.vue';
import Admin from './Admin.vue';
import './plugins/vuetify';

import moment from 'moment';
import VueMoment from 'vue-moment';

Vue.use(VueMoment, { moment });
Vue.config.productionTip = false;

const routes: {[index: string]: Component} = {
  '/': App,
  '/admin': Admin,
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
