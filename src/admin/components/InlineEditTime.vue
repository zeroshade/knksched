<template>
  <v-edit-dialog lazy large persistent
    @open='open()'
    @cancel='cancel()'
    @save='$emit("save")'
  >
    {{ value }}
    <v-time-picker slot='input' v-model='picker'></v-time-picker>
  </v-edit-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment';

@Component
export default class InlineEditTime extends Vue {
  @Prop(String) public value!: string;

  public saved: string = '';
  public get picker(): string {
    return moment(this.value, 'h:mm A').format('HH:mm');
  }

  public set picker(val: string) {
    const res = moment(val, 'HH:mm').format('h:mm A');
    this.$emit('input', res);
  }

  public open() {
    this.saved = this.value;
    this.$emit('open');
  }

  public cancel() {
    this.$emit('cancel');
    this.$emit('input', this.saved);
  }
}
</script>
