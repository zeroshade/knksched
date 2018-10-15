<template>
  <v-card>
    <v-card-text>
      <v-layout row>
        <v-flex xs5>
          <span class='text-xs-left'>
            <span class='font-weight-bold'>Start Date:</span>
            {{ schedule.dayStart | moment('ddd, MMM Do') }}
          </span>
        </v-flex>
        <v-flex xs5 offset-xs2>
          <span class='text-xs-right'>
            <span class='font-weight-bold'>End Date:</span>
            {{ schedule.dayEnd | moment('ddd, MMM Do') }}
          </span>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import Schedule from '../../helpers/schedule';

@Component
export default class SchedInfo extends Vue {
  @Prop(Object) public schedule!: Schedule;
}
</script>
