<template>
  <v-list-group prepend-icon="event" value="true">
    <v-list-tile slot="activator">
      <v-list-tile-title>Events</v-list-tile-title>
    </v-list-tile>
    <template v-for='(item, index) in items'>
      <v-divider></v-divider>

      <v-list-tile @click='$emit("input", index)' :value='value === index'>
        <v-list-tile-title>{{ item }}</v-list-tile-title>
        <v-list-tile-action>
          <slot v-bind:item='item'></slot>
        </v-list-tile-action>
      </v-list-tile>
    </template>
  </v-list-group>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class EventNav extends Vue {
  @Prop(Number) public value!: number;
  @Prop(Array) public items!: string[];
}
</script>
