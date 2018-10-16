<template>
  <v-container :style='gridStyle'>
    <TimeGrid :times='times' :pixelHeight='pixelHeight'></TimeGrid>
    <Schedule :pixelHeight='pixelHeight' :colorMap='colorMap'
      :eventcols='eventsByDay' :height='height'>
      <template slot-scope='{ col }'>
        {{ col.day | moment('dddd') }}
      </template>
    </Schedule>
  </v-container>
</template>

<script lang='ts'>
import { Component, Prop } from 'vue-property-decorator';
import BaseGrid from '../../mixins/base-grid';
import TimeGrid from './TimeGrid.vue';
import Schedule from './Schedule.vue';
import Event, { EventCol } from '../../helpers/event';
import moment from 'moment';

@Component({
  components: {
    TimeGrid,
    Schedule,
  },
})
export default class AgendaGrid extends BaseGrid {
  public get eventsByDay(): EventCol[] {
    if (this.schedule === null) { return []; }

    return this.schedule.dateRange().map((day: Date): EventCol => {
      const end = moment(day).add(this.schedule.numHours, 'hours');
      return {
        day,
        events: this.eventsInOrder(this.schedule.events.filter((ev: Event) =>
          ev.start().isBetween(day, end, undefined, '[]') && !ev.hideAgenda )),
        key: () => day.toString(),
      };
    });
  }
}
</script>
