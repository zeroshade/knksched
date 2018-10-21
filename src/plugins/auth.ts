import { WebAuth, Management, Auth0DecodedHash, Auth0Error, Auth0UserProfile } from 'auth0-js';
import _Vue from 'vue';

const auth0 = new WebAuth({
  domain: process.env.VUE_APP_AUTH0_DOMAIN,
  clientID: process.env.VUE_APP_AUTH0_CLIENT_ID,
  redirectUri: `http://${location.host}${process.env.BASE_URL}callback`,
  responseType: 'token id_token',
  scope: 'openid profile permissions roles email',
  audience: 'https://knk.auth0.com/api/v2/',
});

export class Auth extends _Vue {
  public get userfavs(): number[] {
    return this.user['http://www.thelazydm.org/favs'];
  }

  public toggleFavorite(id: number): boolean {
    const auth0mg = new Management({
      domain: process.env.VUE_APP_AUTH0_DOMAIN || '',
      token: this.profileToken,
    });
    let favs = this.userfavs;
    const ret = !favs.includes(id);
    if (ret) {
      favs.push(id);
    } else {
      favs = favs.filter((f) => f !== id);
    }

    auth0mg.patchUserMetadata(this.user.sub, {favs}, (err, prof: Auth0UserProfile) => {
      const user = this.user;
      user['http://www.thelazydm.org/favs'] = prof.user_metadata.favs;
      this.user = user;
    });

    return ret;
  }

  public get profileToken(): string {
    return localStorage.getItem('profile_token') || '';
  }

  public set profileToken(token: string) {
    localStorage.setItem('profile_token', token);
  }

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
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  public set user(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public isAdmin(): boolean {
    return this.isAuthenticated() && this.user['http://www.thelazydm.org/roles'].includes('admin');
  }

  public login(redir: string) {
    localStorage.setItem('redir', redir);
    auth0.authorize();
  }

  public logout(redir: string) {
    return new Promise((resolve, reject) => {
      auth0.logout({
        returnTo: `http://${location.host}${process.env.BASE_URL}${redir}`,
        clientID: process.env.VUE_APP_AUTH0_CLIENT_ID,
      });
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      localStorage.removeItem('user');
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
          auth0.checkSession({
            scope: 'read:current_user update:current_user_metadata create:current_user_metadata',
          }, (_, result) => {
            this.profileToken = result.accessToken;
            resolve();
          });
        } else if (err) {
          this.logout(process.env.BASE_URL || '');
          reject(err);
        }
      });
    });
  }
}

export default function AuthPlugin(Vue: typeof _Vue, options?: any): void {
  Vue.prototype.$auth = new Auth();
}
