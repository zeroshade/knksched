<template>
  <div>
    <v-layout align-top justify-left pb-2>
      <v-flex xs5>
        <transition name='scale-transition'>
          <SchedInfo v-if='schedule !== null' :schedule='schedule'></SchedInfo>
        </transition>
      </v-flex>
      <transition name='scale-transition'>
        <v-flex offset-xs1 xs5 v-if='schedule != null'>
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
      </transition>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <transition name='scale-transition'>
          <EventTable v-if='schedule !== null'
            @new-event='e => schedule.events.push(e)'
            :schedId='schedule.id'
            :events='schedule.events'
            :dateRange='schedule.dateRangeOptions()'
          ></EventTable>
        </transition>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import SchedInfo from './SchedInfo.vue';
import EventTable from './EventTable.vue';
import Schedule from '@/helpers/schedule';

@Component({
  components: {
    SchedInfo,
    EventTable,
  },
})
export default class AdminPanel extends Vue {
  @Prop(Object) public schedule!: Schedule | null;
}
</script>
