<template>
  <div>
    <v-container fluid>
      <v-layout row wrap justify-center>
        <v-radio-group v-model='roomidx' row style='max-width: 250px'>
          <v-radio v-for='(d, idx) in dateRange' :label='d | moment("dddd")'
           :value='idx' :key='idx' class='mb-0'></v-radio>
        </v-radio-group>
      </v-layout>
    </v-container>
    <v-container :style='gridStyle'>
      <TimeGrid :times='filteredTimes' :pixelHeight='pixelHeight' />
      <Schedule :pixelHeight='pixelHeight' :eventcols='eventsByRoom[roomidx]'
        :height='pixelHeight * (filteredTimes.length + 1) + 1' :colorMap='colorMap'>
        <template slot-scope='{ col }'>
          {{ col.key() }}
        </template>
      </Schedule>
    </v-container>
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator';
import BaseGrid from '../../mixins/base-grid';
import TimeGrid from './TimeGrid.vue';
import Schedule from './Schedule.vue';
import Event, { EventCol } from '../../helpers/event';
import moment from 'moment';
import { groupBy, mapValues, toPairs, keys } from 'lodash';

@Component({
  components: {
    TimeGrid,
    Schedule,
  },
})
export default class RoomGrid extends BaseGrid {
  public roomidx: number = 0;

  public get filteredTimes(): string[] {
    const col = this.eventsByRoom[this.roomidx];
    if (!col) { return this.times; }
    return this.times.slice((moment(col[0].day).hours() - 12) * 2);
  }

  public get eventsByRoom(): EventCol[][] {
    return this.dateRange.map((day): EventCol[] => {
      const end = moment(day).add(this.schedule.numHours, 'hours');
      const byRoom: {[index: string]: Event[][]} = mapValues(groupBy(this.schedule.events.filter(
        (ev: Event) => ev.start().isBetween(day, end, undefined, '[]')),
        (e: Event) => (keys(this.colorMap).indexOf(e.room) !== -1) ? e.room : 'other'), this.eventsInOrder);

      const first = toPairs(byRoom).map((e) => e[1][0][0].start())
        .sort((a, b) => a.isBefore(b) ? -1 : b.isBefore(a) ? 1 : 0)[0];

      day.setHours(first.hours());

      return toPairs(byRoom).map(
        (e) => ({day, events: e[1], key: () => e[0]}),
      ).sort((a, b) => a.key() < b.key() ? -1 : a.key() > b.key() ? 1 : 0);
    });
  }
}
</script>
