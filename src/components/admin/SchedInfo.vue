<template>
  <div>
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
    <v-card class='mt-3'>
      <v-card-title class='headline'>Colors!</v-card-title>
      <v-card-text>
        <v-data-table
          hide-headers
          hide-actions
          :headers-length='2'
          :items='roomNames'>
          <template slot='items' slot-scope='{ item }'>
            <td>{{ item }}</td>
            <td :class='getColorFromMap(item)' width="50%">
              <v-edit-dialog lazy persistent large
                @open='open(item)'
                @save='save(item)'
              >
                {{ getColorFromMap(item) }}
                <template slot='input'>
                  <p :class='fullColor + " white--text"'>{{fullColor}}</p>
                  <v-select dense label='color' v-model='primary'
                    :items='colorNames'></v-select>
                  <v-select dense label='modifier' v-model='modifier'
                    :items='modifierNames'></v-select>
                </template>
              </v-edit-dialog>
            </td>
          </template>
        </v-data-table>

      </v-card-text>
    </v-card>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import Schedule from '../../helpers/schedule';
import { pick, uniq, keys } from 'lodash';
import colors from 'vuetify/es5/util/colors';

function camelCaseToDash(str: string): string {
    return str
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/([0-9])([^0-9])/g, '$1-$2')
        .replace(/([^0-9])([0-9])/g, '$1-$2')
        .replace(/-+/g, '-')
        .toLowerCase();
}

@Component
export default class SchedInfo extends Vue {
  @Prop(Object) public schedule!: Schedule;

  public primary = '';
  public modifier = '';
  public tempColor = '';

  private readonly deflabel = 'Default Color';

  public open(item: string) {
    this.tempColor = this.getColorFromMap(item);
    const s = this.tempColor.split(' ');
    this.primary = s[0];
    if (s.length > 1) {
      this.modifier = s[1];
    }
  }

  public save(item: string) {
    if (item === this.deflabel) {
      item = 'other';
    }
    const colormap = Object.assign({}, this.schedule.colorMap);
    colormap[item] = this.fullColor;
    this.schedule.colorMap = colormap;
    this.schedule.save();
  }

  public get fullColor(): string {
    return this.primary + ' ' + this.modifier;
  }

  public get modifierNames(): string[] {
    return keys(colors.red).map(camelCaseToDash);
  }

  public getColorFromMap(room: string): string {
    return this.schedule.colorMap[room] || this.schedule.colorMap.other;
  }

  public get colorNames(): string[] {
    return keys(colors).map(camelCaseToDash);
  }

  public get roomNames(): string[] {
    const rooms = uniq(this.schedule.events.map((e) => pick(e, 'room').room).sort());
    rooms.push(this.deflabel);
    return rooms;
  }
}
</script>
