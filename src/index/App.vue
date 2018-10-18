<template>
  <v-app dark>
    <v-navigation-drawer
      v-model='drawer'
      absolute
      temporary
    >
      <v-list class='pa-1'>
        <v-list-tile tag='div'>
          <v-list-tile-content>
            <v-list-tile-title>Events</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list class='pt-0' dense>
        <v-divider light></v-divider>

        <v-list-tile v-for='(s, idx) in items' :value='schedule === idx'
          :key='s.id' @click='schedule = idx'>
          <v-list-tile-action v-if='idx === select'>
            <v-icon>chevron_right</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ s.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <v-list class='pa-1'>
        <v-list-tile tag='div'>
          <v-list-tile-content>
            <v-list-tile-title class='caption'><a href='/privacy'>Privacy Policy</a></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dense tabs color='orange' app>
      <v-toolbar-side-icon @click.stop='drawer = !drawer'></v-toolbar-side-icon>
      <v-toolbar-title>Kith &amp; Kink Schedule</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tabs slot='extension' centered grow color='orange' slider-color='yellow' v-model='tab'>
        <v-tab ripple>Agenda</v-tab>
        <v-tab ripple>Room View</v-tab>
        <v-tab ripple>Event View</v-tab>
      </v-tabs>
    </v-toolbar>
    <v-content>
      <v-tabs-items v-model='tab'>
        <v-tab-item>
          <Agenda :pixelHeight='50' :schedule='curSchedule'></Agenda>
        </v-tab-item>
        <v-tab-item>
          <RoomGrid :pixelHeight='50' :schedule='curSchedule'></RoomGrid>
        </v-tab-item>
        <v-tab-item>
          <ByEvent :pixelHeight='50' :schedule='curSchedule'></ByEvent>
        </v-tab-item>
      </v-tabs-items>
    </v-content>
    <v-footer :fixed='fixed' app>
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Schedule, { loadSchedules } from '@/helpers/schedule';
import Agenda from './components/Agenda.vue';
import RoomGrid from './components/RoomGrid.vue';
import ByEvent from './components/ByEvent.vue';

@Component({
  components: {
    Agenda,
    RoomGrid,
    ByEvent,
  },
})
export default class App extends Vue {
  public items: Schedule[] = [];
  public select: number | null = null;
  public drawer = false;
  public tab: number = 1;
  public fixed = false;

  public created() {
    loadSchedules().then((scheds: Schedule[]) => {
      this.items = scheds;
      this.schedule = 0;
    });
  }

  public get schedule(): number {
    if (this.select === null) { return -1; }
    return this.select;
  }

  public set schedule(idx: number) {
    this.items[idx].loadEvents().then(() => {
      this.select = idx;
      this.drawer = false;
    });
  }

  public get curSchedule(): Schedule | null {
    if (this.select === null) { return null; }
    return this.items[this.select];
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #ef6100;
}
</style>
