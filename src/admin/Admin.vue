<template>
  <v-app dark>
    <v-toolbar dark app clipped-left dense>
      <v-toolbar-side-icon><a href='/'><v-icon>home</v-icon></a></v-toolbar-side-icon>
      <v-toolbar-title>
        Admin Panel
        {{ (select !== null) ? `> ${curSchedule.title}` : '' }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn round color="secondary" dark v-if='!$auth.isAuthenticated()' @click='login()'>
        Login
      </v-btn>
      <template v-else>
        <v-avatar class='mt-1' :tile='false' size='38px' color='grey lighten-4'>
          <img :src='$auth.user.picture' alt='avatar' />
        </v-avatar>
        <v-btn round color="secondary" dark @click='$auth.logout("admin")'>Logout</v-btn>
      </template>
    </v-toolbar>
    <v-navigation-drawer dark app clipped permanent width='250'>
      <v-list dense v-if='$auth.isAuthenticated() && items.length > 0 && $auth.isAdmin()'>
        <EventNav v-model='schedule' :items='items.map(s => s.title)'>
          <v-icon slot-scope='props'>mdi-calendar-edit</v-icon>
        </EventNav>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-container fluid>
        <AdminPanel :schedule='curSchedule'></AdminPanel>
      </v-container>
    </v-content>
    <div class='text-xs-center'>
      <v-dialog
        v-model='dialog'
        hide-overlay
        persistent
        width='300'
      >
        <v-card color='primary' dark>
          <v-card-text>
            Logging in...
            <v-progress-linear indeterminate color='white' class='mb-0'></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SchedHeaders } from '@/helpers/data';
import Schedule, { loadSchedules } from '@/helpers/schedule';
import EventNav from '@/components/EventNav.vue';
import AdminPanel from './components/AdminPanel.vue';
import axios from 'axios';

@Component({
  components: {
    AdminPanel,
    EventNav,
  },
})
export default class Admin extends Vue {
  public readonly headers = SchedHeaders;
  public dialog = false;
  public items: Schedule[] = [];
  public select: number | null = null;

  public created() {
    loadSchedules().then((scheds: Schedule[]) => {
      this.items = scheds;
    });
  }

  public login() {
    this.dialog = true;
    this.$auth.login('/admin');
  }

  public get schedule(): number {
    if (this.select === null) { return -1; }
    return this.select;
  }

  public set schedule(idx: number) {
    this.items[idx].loadEvents().then(() => {
      this.select = idx;
    });
  }

  public get curSchedule(): Schedule | null {
    if (this.select === null) { return null; }
    return this.items[this.select];
  }

  // public async testAuth() {
  //   const resp = await axios.get(`${process.env.VUE_APP_BACKEND}/test/secured`, {
  //     headers: { Authorization: `Bearer ${this.$auth.accessToken}` }
  //   });
  //   console.log(resp);
  // }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  // color: #2c3e50;
}

</style>
