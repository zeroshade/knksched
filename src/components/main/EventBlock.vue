<template>
  <v-layout row justify-center class='full evlayout'>
    <template v-for='(col, idx) in eventColumns'>
      <v-flex :class="`evcol ${(idx > 0) ? 'ml-1' : ''} ${(idx < eventColumns.length - 1) ? 'mr-1' : ''}`"
        v-bind="{[`xs${Math.floor(12/eventColumns.length)}`]: true}" d-block
        v-bind:style="{
           top: (2 * pixelHeight * col[0].start().diff(date, 'hours', true) - 1) + 'px',
           marginTop: 0,
          }"
      >
        <div v-for='ev in colItems(col)' class="text-xs-center" v-bind:style="{
            height: (ev.ev.duration().asMinutes()/30 * pixelHeight - 1) + 'px',
            marginTop: ev.margin + 'px',
          }">
          <v-btn class='entry full-height pl-0 pr-0' dark :color='colorMap[ev.ev.room] || colorMap["other"]'
            @click.stop='ev.ev.viewing = true' block>
            <span v-bind:style="{
                height: (ev.ev.duration().asMinutes()/30 * pixelHeight - 12) + 'px',
              }">
              <v-icon small v-if='ev.ev.icon' dark>{{ev.ev.icon}}</v-icon>
              {{ ev.ev.title }}
            </span>
          </v-btn>
          <v-dialog v-model="ev.ev.viewing" width="500">
            <v-card>
              <v-card-title :class='`${colorMap[ev.ev.room] || colorMap["other"]} headline`' primary-title>
                {{ ev.ev.title }} <v-icon v-if='ev.ev.icon' dark>{{ ev.ev.icon}}</v-icon>
              </v-card-title>

              <v-card-text>
                <v-layout fluid>
                  <v-flex xs6>
                    <p class='font-weight-bold'>{{ ev.ev.startTime }} - {{ ev.ev.endTime }}</p>
                  </v-flex>
                  <v-flex xs6>
                    <p class='font-italic text-xs-right'><strong>Duration:</strong>&nbsp;
                      <span v-if='ev.ev.duration().hours()'>{{ ev.ev.duration().hours() }}h</span>
                      <span v-if='ev.ev.duration().minutes()'>{{ ev.ev.duration().minutes() }}m</span>
                    </p>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs6>
                    <p class='font-weight-medium font-italic'><strong>Room:</strong> {{ ev.ev.room }}</p>
                  </v-flex>
                  <v-flex xs6>
                    <p class='font-weight-medium font-italic text-xs-right'><strong>Organizer:</strong> {{ ev.ev.organizer }}</p>
                  </v-flex>
                </v-layout>
                <p v-if='ev.ev.desc' class='font-weight-medium'>{{ ev.ev.desc }}</p>
              </v-card-text>
            </v-card>
          </v-dialog>
        </div>
      </v-flex>
    </template>
  </v-layout>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import Event from '../../helpers/event';

@Component
export default class EventBlock extends Vue {
  @Prop({type: Number, default: 50}) public pixelHeight!: number;
  @Prop(Array) public events!: Event[];
  @Prop(Date) public date!: Date;
  @Prop(Object) public colorMap!: {[index: string]: string};

  public get eventColumns(): Event[][] {
    const cols: Event[][] = [];

    for (const ev of this.events) {
      let placed: boolean = false;

      for (const c of cols) {
        const lastEvent: Event = c[c.length - 1];
        const end = lastEvent.start().add(lastEvent.duration());

        if (ev.start().isAfter(end)) {
          c.push(ev);
          placed = true;
          break;
        }
      }

      if (placed) {
        continue;
      }

      cols.push([ev]);
    }
    return cols;
  }

  public colItems(col: Event[]): Array<{ ev: Event, margin: number}> {
    const res: Array<{ev: Event, margin: number}> = [];
    for (const ev of col) {
      if (!res.length) {
        res.push({ev, margin: 0});
        continue;
      }
      const lastEvent = res[res.length - 1].ev;
      const prevEnd = lastEvent.start().add(lastEvent.duration());
      res.push({ev, margin: this.pixelHeight * (ev.start().diff(prevEnd, 'minutes') / 30) + 1});
    }
    return res;
  }
}
</script>

<style scoped lang='scss'>
.full {
  width: 100%;
}

.full-height {
  height: 100%;
}

.evlayout {
  position: absolute;
  pointer-events: none;
}

.evcol {
  position: relative;
  pointer-events: auto;
}

.entry {
  margin-top: 0;

  span {
    white-space: pre-line;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 10px;
  }
}
</style>
