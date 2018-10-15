<template>
  <v-menu
    ref='menu'
    v-model='menu'
    :close-on-content-click='false'
    :nudge-right='40'
    lazy
    transition='scale-transition'
    offset-y
    full-width
    max-width='290px'
    min-width='290px'
  >
    <v-text-field
      :label='label'
      slot='activator'
      :error='error'
      :error-messages='errorMessages'
      prepend-icon='access_time'
      :value='value'
      readonly>
    </v-text-field>
    <v-time-picker
      v-if='menu'
      v-model='time'
      @change='$refs.menu.save(time)'>
    </v-time-picker>
  </v-menu>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment';

@Component
export default class TimeInput extends Vue {
  @Prop(String) public value!: string;
  @Prop(String) public label!: string;
  @Prop({type: Boolean, default: false}) public error!: boolean;
  @Prop(Array) public errorMessages?: string[];

  public menu = false;

  public get time(): string {
    return moment(this.value, 'h:mm A').format('HH:mm');
  }

  public set time(ev: string) {
    this.$emit('input', moment(ev, 'HH:mm').format('h:mm A'));
  }
}
</script>
