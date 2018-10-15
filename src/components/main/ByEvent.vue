<template>
  <v-container grid-list-md fluid>
    <template v-for='day in dateRange'>
      <v-data-iterator :pagination.sync='pagination' :search='search'
        :items='events.filter(i => i.start().isBetween(day, $moment(day).add(numHours, "hours"), undefined, "[)"))'
        row wrap hide-actions content-tag='v-layout' :custom-sort='customSort' :filter='filter'>
        <p slot='header' class='ma-3 subheading font-italic white--text text-uppercase'>{{ day | moment('dddd') }}</p>
        <v-flex slot='item' slot-scope='props' xs12 sm6 md4 lg3>
          <v-card raised height='100%' class='elevation-9' :class='colorMap[props.item.room] || colorMap["other"]'>
            <v-card-title class='title'>{{ props.item.title }}</v-card-title>
            <v-card-text>
              <p class='caption font-italic font-weight-medium'>{{ props.item.start().format('h:mm A') }} :: {{ props.item.room }}</p>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-data-iterator>
    </template>
  </v-container>
</template>

<script lang='ts'>
import { Component, Prop } from 'vue-property-decorator';
import BaseGrid from '../../mixins/base-grid';
import Event from '../../helpers/event';
import moment from 'moment';

@Component
export default class ByEvent extends BaseGrid {
  public pagination: object = {rowsPerPage: -1};
  public search = '';

  public get events(): Event[] {
    if (this.schedule === null) { return []; }
    return this.schedule.events;
  }

  public get numHours(): number {
    if (this.schedule === null) { return 0; }
    return this.schedule.numHours;
  }

  public customSort(items: Event[],
                    index: undefined | ((a: Event, b: Event) => number),
                    isDescending: boolean): Event[] {
    items.sort(index || this.sortEvent);
    if (isDescending) {
      items.reverse();
    }
    return items;
  }

  public filter(val: object, search: string): boolean {

    return val != null && typeof val !== 'boolean'
      && val.toString().toLowerCase().indexOf(search) !== -1;
  }
}
</script>
