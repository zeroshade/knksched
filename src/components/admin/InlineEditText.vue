<template>
  <v-edit-dialog lazy
    :return-value.sync='saved'
    @cancel='$emit("cancel")'
    @open='open()'
    @save='save()'
  >
    {{ value }}
    <v-text-field slot='input'
      :value='saved'
      @input='saved = (lower) ? $event.toLowerCase() : $event'
      label='Edit'
      single-line
      :rules='[() => !!saved || "Must not be empty"]'
      counter
      required>
    </v-text-field>
  </v-edit-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class InlineEditText extends Vue {
  @Prop(String) public value!: string;
  @Prop({type: Boolean, default: false}) public lower!: boolean;

  public saved = '';

  public save() {
    if (this.saved.length !== 0) {
      this.$emit('input', this.saved);
      this.$emit('save');
    } else {
      this.$emit('error', 'Empty');
    }
  }

  public open(): void {
    this.saved = this.value;
    this.$emit('open');
  }
}
</script>
