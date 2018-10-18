import { WebAuth, Auth0DecodedHash, Auth0Error } from 'auth0-js';
import _Vue from 'vue';


const auth0 = new WebAuth({
  domain: 'knk.auth0.com',
  clientID: 'dUEhXbg2I06rtQhgdr0CMCzLcxOQp5qE',
  redirectUri: `http://${location.host}${process.env.BASE_URL}/callback`,
  responseType: 'token id_token',
  scope: 'openid name email picture',
});

export class Auth extends _Vue {
  public get token(): string {
    return localStorage.getItem('id_token') || '';
  }

  public set token(idToken: string) {
    localStorage.setItem('id_token', idToken);
  }

  public get accessToken(): string {
    return localStorage.getItem('access_token') || '';
  }

  public set accessToken(accessToken: string) {
    localStorage.setItem('access_token', accessToken);
  }

  public get expiresAt(): number {
    return Number(localStorage.getItem('expires_at')) || 0;
  }

  public set expiresAt(expiresIn: number) {
    const expiresAt = JSON.stringify(expiresIn * 1000 + new Date().getTime());
    localStorage.setItem('expires_at', expiresAt);
  }

  public get user(): any {
    return JSON.parse(localStorage.getItem('user') || '');
  }

  public set user(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public login() {
    auth0.authorize();
  }

  public logout() {
    return new Promise((resolve, reject) => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      window.location.pathname = '/admin';
      resolve();
    });
  }

  public isAuthenticated(): boolean {
    return new Date().getTime() < this.expiresAt;
  }

  public handleAuthentication(): Promise<void> {
    return new Promise((resolve, reject) => {
      auth0.parseHash((err: null | Auth0Error, authResult: Auth0DecodedHash) => {
        if (authResult && authResult.accessToken && authResult.idToken && authResult.expiresIn) {
          this.expiresAt = authResult.expiresIn;
          this.accessToken = authResult.accessToken;
          this.token = authResult.idToken;
          this.user = authResult.idTokenPayload;
          resolve();
        } else if (err) {
          this.logout();
          reject(err);
        }
      });
    });
  }
}

export default function AuthPlugin(Vue: typeof _Vue, options?: any): void {
  Vue.prototype.$auth = new Auth();
}
