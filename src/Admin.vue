<template>
  <v-app dark>
    <v-toolbar dark app clipped-left dense>
      <v-toolbar-title>
        Admin Panel
        {{ (select !== null) ? `> ${curSchedule.title}` : '' }}
      </v-toolbar-title>
    </v-toolbar>
    <v-navigation-drawer dark app clipped permanent width='250'>
      <v-list dense>
        <v-list-tile>
          <v-list-tile-content>
            <v-btn v-if='!$auth.isAuthenticated()' @click='$auth.login()'>Login</v-btn>
            <v-btn v-else @click='$auth.logout().then(() => {$forceUpdate();})'>Logout</v-btn>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>

        <v-list-group prepend-icon="event" value="true">
          <v-list-tile slot="activator">
            <v-list-tile-title>Events</v-list-tile-title>
          </v-list-tile>

          <template v-for='(item, index) in items'>
            <v-divider></v-divider>

            <v-list-tile @click='schedule = index' :value='schedule === index'>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-action>
                <v-icon>mdi-calendar-edit</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-container fluid v-if='curSchedule !== null'>
        <v-layout align-top justify-left pb-2>
          <v-flex xs5>
            <SchedInfo :schedule='curSchedule'></SchedInfo>
          </v-flex>
          <v-flex offset-xs1 xs5>
            <v-card>
              <v-card-title>Icon Links</v-card-title>
              <v-card-text>
                <p>
                  Visit one of the links below to see icons. Use the name in the icon field to use it.
                  For instance, on the Material Icons list (the second link) you can find the icon named
                  'rowing'. If you put `rowing` in the icon text field, you'll get <v-icon>rowing</v-icon></p>
                <p><a href='https://cdn.materialdesignicons.com/2.8.94/'>Material Design Icons</a></p>
                <p><a href='https://material.io/tools/icons/'>Material Icons</a></p>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12>
            <EventTable
              @new-event='e => curSchedule.events.push(e)'
              :schedId='curSchedule.id'
              :events='curSchedule.events'
              :dateRange='curSchedule.dateRangeOptions()'
            ></EventTable>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SchedHeaders } from './helpers/data';
import Schedule, { loadSchedules } from './helpers/schedule';
import SchedInfo from './components/admin/SchedInfo.vue';
import EventTable from './components/admin/EventTable.vue';

@Component({
  components: {
    SchedInfo,
    EventTable,
  },
})
export default class Admin extends Vue {
  public readonly headers = SchedHeaders;
  public items: Schedule[] = [];
  public select: number | null = null;

  public created() {
    loadSchedules().then((scheds: Schedule[]) => {
      this.items = scheds;
    });
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
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;

}

</style>
