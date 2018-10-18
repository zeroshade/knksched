import { Auth } from './plugins/auth';

declare module 'vue/types/vue' {
  interface Vue {
    $auth: Auth;
  }
}
