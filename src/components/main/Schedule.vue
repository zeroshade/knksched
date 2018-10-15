<template>
  <v-layout row justify-start align-baseline class='events'>
    <template v-if='$vuetify.breakpoint.smAndUp'>
      <v-flex v-for='col in eventcols'
        :style="{ height: height + 'px'}"
        d-block class='event-group mb-0'
        v-bind='{ [`xs${12/eventcols.length}`]: true }'
        :key='col.key()'
      >
        <v-card flat tile class='top-info'>
          <v-card-title>
            <span class='text-xs-center' style='width: 100%; padding: 0 .5em'>
              <slot v-bind:col='col'></slot>
            </span>
          </v-card-title>
        </v-card>

        <div class='eventcol ml-1 mr-1'>
          <template v-for='ev in col.events'>
            <EventBlock :pixelHeight='pixelHeight'
              :colorMap='colorMap' :events='ev' :date='col.day'>
            </EventBlock>
          </template>
        </div>
      </v-flex>
    </template>
    <template v-else>
      <v-flex
        :style="{ height: height + 'px' }"
        d-block class='event-group mb-0'
        xs12
      >
        <v-menu offset-y class='top-info'>
          <v-card flat tile slot='activator'>
            <v-card-title>
              <span class='text-xs-center' style='width: 100%; padding: 0 .5em'>
                <slot v-bind:col='eventcols[showcol].events'></slot> <v-icon dark>expand_more</v-icon>
              </span>
            </v-card-title>
          </v-card>
          <v-list>
            <template v-for='(col, idx) in eventcols' v-if='idx !== showcol'>
              <v-divider :key="`divider-${idx}`"></v-divider>
              <v-list-tile :key='`menu-${idx}`' @click='showcol = idx'>
                <v-list-tile-title><slot v-bind:col='col'></slot></v-list-tile-title>
              </v-list-tile>
            </template>
          </v-list>
        </v-menu>

        <div class='eventcol ml-1 mr-1'>
          <template v-for='ev in eventcols[showcol].events'>
            <EventBlock :pixelHeight='pixelHeight' :colorMap='colorMap'
              :events='ev' :date='eventcols[showcol].day'>
            </EventBlock>
          </template>
        </div>
      </v-flex>
    </template>
  </v-layout>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { EventCol } from '../../helpers/event';
import EventBlock from './EventBlock.vue';

@Component({
  components: {
    EventBlock,
  },
})
export default class Schedule extends Vue {
  @Prop(Number) public pixelHeight!: number;
  @Prop(Number) public height!: number;
  @Prop(Array) public eventcols!: EventCol[];
  @Prop(Object) public colorMap!: {[index: string]: string};

  public showcol: number = 0;
}
</script>

<style scoped lang='scss'>
.events {
  width: calc(100% - 50px);
  margin-left: 50px;
  position: relative;
  z-index: 1;
  height: 1450px;
}

.top-info {
  height: 50px;
  border-bottom: 1px solid purple;
  padding: 0px;
  width: 100%;

  div {
    width: 100%;
    height: 100%;
    padding: 0px;
  }

  span {
    width: 100%;
    padding: 0 .5em;
  }
}

.event-group {
  background: none;
  border: 1px solid purple;

  div.eventcol {
    padding: 0px;
    position: relative;
    height: 100%;
  }
}
</style>
