<template>
  <v-form ref='form' v-model='valid' lazy-validation>
    <v-card>
      <v-card-title primary-title>
        <span class='headline'>New Event</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout>
            <v-flex xs4 sm2 md2>
              <v-select label='Day'
                v-model='value.day'
                :rules='[v => !!v || "Day is required"]'
                :items='dates'></v-select>
            </v-flex>
            <v-flex xs8 sm10 md10>
              <v-text-field label='Title'
                v-model='value.title'
                :rules='[v => !!v || "Title is required"]'>
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 sm6 md6>
              <v-text-field label='Organizer'
                :rules='[v => !!v || "Organizer is required"]'
                v-model='value.organizer'>
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-text-field label='Room'
                :rules='[v => !!v || "Room is required"]'
                v-model='value.room'>
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 sm6 md6>
              <TimeInput label='Start Time'
                v-model='value.startTime'
                :error='error'
                :errorMessages='errorMessages'>
              </TimeInput>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <TimeInput label='End Time'
                v-model='value.endTime'
                :error='error'
                :errorMessages='errorMessages'>
              </TimeInput>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-textarea label='Description' v-model='value.desc'></v-textarea>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color='primary' flat @click.native='$emit("close")'>Close</v-btn>
        <v-btn color='primary' flat @click.native='save'>Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import Event, { IEvent } from '../../helpers/event';
import TimeInput from './TimeInput.vue';

@Component({
  components: {
    TimeInput,
  },
})
export default class EventForm extends Vue {
  @Prop(Object) public value!: IEvent;
  @Prop(Array) public dates!: Array<{text: string, value: string}>;

  public valid = true;

  public save(): void {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      this.$emit('save');
    }
  }

  public get error(): boolean {
    const ev = new Event(this.value);
    return !ev.validate();
  }

  public get errorMessages(): string[] {
    if (this.error) {
      return ['Start Time cannot be before End Time'];
    }
    return [];
  }
}
</script>
