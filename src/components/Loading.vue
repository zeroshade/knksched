<template>
  <div class='text-xs-center'>
    <v-dialog
      hide-overlay
      persistent
      width='300'
      :value='value'
    >
      <v-card :color='color' class='elevation-8'>
        <v-card-text>
          <slot></slot>
          <v-progress-linear indeterminate color='white' class='mb-0'></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Loading extends Vue {
  @Prop(Boolean) public value!: boolean;
  @Prop(String) public color!: string;
}
</script>
