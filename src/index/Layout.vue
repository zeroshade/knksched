<template>
  <v-app dark id='schedule'>
    <v-navigation-drawer
      v-model='drawer'
      temporary
      app
    >
      <v-list class='pa-1'>
        <v-list-tile tag='div'>
          <v-list-tile-title>Events</v-list-tile-title>
          <v-list-tile-action>
            <v-tooltip right>
              <v-icon slot='activator' @click='refresh()'>refresh</v-icon>
              <span>Refresh the Events</span>
            </v-tooltip>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-list class='pt-0' dense>
        <v-divider light></v-divider>

        <v-list-tile v-for='(s, idx) in items' :value='select === idx'
          :key='s.id' @click='schedule = idx'>
          <v-list-tile-action v-if='idx === select'>
            <v-icon>chevron_right</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ s.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <template v-if='$auth.isAuthenticated()'>
        <v-divider />
        <v-list dense two-line subheader>
          <v-subheader>Starred Events</v-subheader>

          <v-list-tile v-for='e in favs'
            :key='`fav-${e.id}`'
            @click='display(e)'
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ e.title }}</v-list-tile-title>
              <v-list-tile-sub-title>
                {{ e.start().format('ddd') }} - {{ e.startTime }} - {{ e.room }}
              </v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon>star</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </template>
      <v-divider></v-divider>
      <v-list class='pa-1'>
        <v-list-tile tag='div' v-if='$auth.isAdmin()'>
          <v-list-tile-content>
            <v-list-tile-title><router-link to='/admin'>Admin Panel</router-link></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile tag='div'>
          <v-list-tile-content>
            <v-list-tile-title class='caption'><router-link to='/privacy'>Privacy Policy</router-link></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dense tabs color='orange' app>
      <v-toolbar-side-icon @click.stop='drawer = !drawer'><v-icon>menu</v-icon></v-toolbar-side-icon>
      <v-toolbar-title>Kith &amp; Kink Schedule</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn round color='orange darken-4' v-if='!$auth.isAuthenticated()' @click='login()'>Login / Sign Up</v-btn>
      <template v-else>
        <v-avatar class='mt-1' :tile='false' size='38px' color='grey lighten-4'>
          <img :src='$auth.user.picture' alt='avatar' />
        </v-avatar>
        <v-btn round color='orange darken-4' @click='$auth.logout("")'>Logout</v-btn>
      </template>
      <v-tabs slot='extension' centered grow color='orange' slider-color='yellow' v-model='tab'>
        <v-tab ripple to='/agenda'>Agenda</v-tab>
        <v-tab ripple to='/rooms'>Room View</v-tab>
        <v-tab ripple to='/events'>Event View</v-tab>
      </v-tabs>
    </v-toolbar>
    <Loading :value='loading' color='orange darken-2' />
    <v-content>
      <v-dialog v-model='card' width='500'>
        <EventCard v-if='showev !== null' :ev='showev' :color='cardcolor' />
      </v-dialog>
      <transition name='fade-transition'>
        <router-view :pixelHeight='50' :schedule='curSchedule' />
      </transition>
    </v-content>
    <v-footer :fixed='fixed' app>
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import Schedule, { loadSchedules } from '@/helpers/schedule';
import Loading from '@/components/Loading.vue';
import Event from '@/helpers/event';
import EventCard from './components/EventCard.vue';
import { EventBus } from '@/helpers/event-bus';

@Component({
  components: {
    Loading,
    EventCard,
  },
})
export default class Layout extends Vue {
  public items: Schedule[] = [];
  public select: number | null = null;
  public tab: string = '';
  public drawer = false;
  public fixed = false;
  public loading = false;
  public transitionName = '';

  public card = false;
  public showev: Event | null = null;
  public cardcolor = '';

  public favList: number[] = [];

  public created() {
    this.refresh();
    this.tab = this.$route.path;
  }

  public refresh() {
    this.fetch();
  }

  public login() {
    this.loading = true;
    this.$auth.login(this.$route.path);
  }

  public mounted() {
    if (this.$auth.isAuthenticated()) {
      this.favList = this.$auth.userfavs;
    }
    EventBus.$on('event-click', (data: {ev: Event, color: string}) => {
      this.display(data.ev, data.color);
    });
    this.$auth.$on('update:favs', (f: number[]) => { this.favList = f; });
  }

  public display(ev: Event, color?: string) {
    this.showev = ev;
    this.cardcolor = color || this.eventColor(ev);
    this.card = true;
  }

  public eventColor(ev: Event): string {
    if (!this.curSchedule) { return ''; }
    return this.curSchedule.colorMap[ev.room] || this.curSchedule.colorMap.other;
  }

  public async fetch() {
    this.loading = true;
    const scheds = await loadSchedules();
    this.items = scheds;
    this.schedule = 0;
    this.loading = false;
  }

  public get favs(): Event[] {
    if (this.curSchedule === null || !this.favList) { return []; }

    return this.curSchedule.events.filter((e) => this.favList.includes(e.id))
      .sort((a, b) => a.start().diff(b.start()));
  }

  public get schedule(): number {
    return (this.select === null) ? -1 : this.select;
  }

  public set schedule(idx: number) {
    this.items[idx].loadEvents().then(() => {
      this.select = idx;
      this.drawer = false;
    });
  }

  public get curSchedule(): Schedule | null {
    return (this.select === null) ? null : this.items[this.select];
  }
}
</script>

<style lang="scss">
#app {
}

#schedule {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #ef6100;
}

#admin {

}
</style>
