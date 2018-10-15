<template>
  <v-card>
    <v-card-title>
      <p class='headline'>Events</p>
      <v-spacer></v-spacer>
      <v-text-field
        v-model='search'
        append-icon='search'
        label='Search'
        single-line
        hide-details>
      </v-text-field>
    </v-card-title>
    <v-data-table
      :search='search'
      :headers='headers'
      :items='events'
      class='elevation-5'
      :loading='events.length === 0'
    >
      <template slot='footer'>
        <td colspan='100%' align='right'>
          <v-btn @click='open()' dark class='mb-2'>New Event</v-btn>
          <v-dialog v-model='dialog' max-width='500px' persistent>
            <EventForm :dates='dateRange' @close='close'
               @save='save' v-model='tempEvent'>
            </EventForm>
          </v-dialog>
        </td>
      </template>
      <template slot='items' slot-scope='{ item }'>
        <td width='25%' class='text-xs-left'>
          <InlineEditText v-model='item.title'
            @save='saveItem(item)'
            @error='error(`Invalid Name, Must not be ${$event}`)'
          ></InlineEditText>
        </td>
        <td>
          <v-edit-dialog lazy persistent large
            @open='item._day = item.day'
            @cancel='item.day = item._day || item.day'
            @save='saveItem(item)'
          >
            {{ item.day | moment('ddd') }}
            <v-select slot='input' dense flat
              v-model='item.day'
              :items='dateRange'>
            </v-select>
          </v-edit-dialog>
        </td>
        <td>
          <InlineEditText v-model='item.organizer'
            @save='saveItem(item)'
            @error='error(`Invalid Name, Must not be ${$event}`)'
          ></InlineEditText>
        </td>
        <td class='text-xs-left'>
          <InlineEditTime v-model='item.startTime'
            @open='item._startTime = item.startTime'
            @save='item.validate() ? saveItem(item) : (item.startTime = item._startTime) && error("Must not start after it ends")'
          ></InlineEditTime>
        </td>
        <td class='text-xs-left'>
          <InlineEditTime v-model='item.endTime'
            @open='item._endTime = item.endTime'
            @save='item.validate() ? saveItem(item) : (item.endTime = item._endTime) && error("Must not end before it begins")'
          ></InlineEditTime>
        </td>
        <td class='text-xs-left'>
          <InlineEditText v-model='item.room'
            @save='saveItem(item)'
            @error='error(`Invalid Room, Must not be ${$event}`)'
          ></InlineEditText>
        </td>
        <td class='justify-center layout px-0'>
          <v-icon small @click='deleteItem(item)'>delete</v-icon>
        </td>
      </template>
    </v-data-table>
    <v-snackbar v-model='snack' :timeout='3000' :color='snackColor'>
      {{ snackText }}
      <v-btn flat @click='snack = false'>Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import Event, { IEvent } from '../../helpers/event';
import { EventHeaders } from '../../helpers/data';
import InlineEditText from './InlineEditText.vue';
import InlineEditTime from './InlineEditTime.vue';
import EventForm from '../form/EventForm.vue';
import moment from 'moment';

@Component({
  components: {
    InlineEditText,
    InlineEditTime,
    EventForm,
  },
})
export default class EventTable extends Vue {
  @Prop(Array) public events!: Event[];
  @Prop(Array) public dateRange!: Array<{text: string, value: string}>;
  @Prop({type: Number, default: -1}) public schedId!: number;

  public readonly headers = EventHeaders;
  public search = '';
  public snackColor = 'indigo';
  public snackText = '';
  public snack = false;
  public dialog = false;

  public editedEvent: IEvent | null = null;
  public get defaultEvent(): IEvent {
    return {
      id: -1,
      schedId: this.schedId,
      day: this.dateRange[0].value,
      startTime: '12:00 PM',
      endTime: '12:00 PM',
      title: '',
      room: '',
      organizer: '',
    };
  }

  public get tempEvent(): IEvent {
    if (this.editedEvent === null) {
      this.editedEvent = this.defaultEvent;
    }
    return this.editedEvent;
  }

  public async saveItem(ev: Event): Promise<void> {
    await ev.save();
    this.snackText = 'Saving Changes';
    this.snackColor = 'success';
    this.snack = true;
  }

  public async deleteItem(ev: Event): Promise<void> {
    const index = this.events.indexOf(ev);
    const conf = confirm('Are you sure?');
    if (!conf) { return; }

    this.events.splice(index, 1);
    await ev.delete();

    this.snackText = 'Event Deleted';
    this.snackColor = 'success';
    this.snack = true;
  }

  public error(msg: string): void {
    this.snackText = `${msg}, Changes not saved`;
    this.snackColor = 'error';
    this.snack = true;
  }

  public close(): void {
    this.dialog = false;
    this.editedEvent = this.defaultEvent;
  }

  public open(): void {
    this.dialog = true;
  }

  public save(): void {
    if (this.editedEvent === null) {
      this.close();
      return;
    }

    const ev = new Event(this.editedEvent);
    ev.save();
    this.$emit('new-event', ev);
    this.snackText = 'New Event Added';
    this.snackColor = 'success';
    this.snack = true;
    this.close();
  }
}
</script>

<style lang='scss'>
#app > div.v-small-dialog__content {
  margin-top: 50px;
}
</style>
