import { Component, Vue, Prop } from 'vue-property-decorator';
import Schedule from '@/helpers/schedule';
import Event from '@/helpers/event';
import moment from 'moment';

@Component
export default class BaseGrid extends Vue {
  @Prop({type: Number, default: 50}) public pixelHeight!: number;
  @Prop(Object) public schedule!: Schedule;

  public get dateRange(): Date[] {
    if (this.schedule === null) { return []; }

    return this.schedule.dateRange();
  }

  public get colorMap(): {[index: string]: string} {
    if (this.schedule === null) { return {}; }
    return this.schedule.colorMap;
  }

  public get height(): number {
    if (this.schedule === null) { return this.pixelHeight; }

    return this.pixelHeight * (this.schedule.numHours * 2 + 1) + 1;
  }

  public get gridStyle(): {[index: string]: string} {
    const base: {[index: string]: string} = {position: 'relative'};
    if (this.$vuetify.breakpoint.smAndDown) {
      base.paddingTop = '24px';
    }
    // base.height = '1727px';
    return base;
  }

  public get times(): string[] {
    if (this.schedule === null) { return []; }

    const res: string[] = [];
    const start = moment(this.schedule.start, 'HH:mm');
    const end = start.clone().add(this.schedule.numHours, 'hours');
    for (const m = start; m.isBefore(end); m.add(30, 'm')) {
      res.push(m.format('h A'));
    }
    res.push(end.format('h A'));
    return res;
  }

  public eventsInOrder(eventList: Event[]): Event[][] {
    const res: Event[][] = [];
    let cur: Event[] = [];

    eventList.sort(this.sortEvent);

    let curEnd: moment.Moment | null = null;
    for (const current of eventList) {
      if (cur.length === 0) {
        cur.push(current);
        curEnd = cur[0].start();
        curEnd.add(current.duration());
        continue;
      }

      if (current.start().isBetween(cur[0].start(), curEnd as moment.Moment, undefined, '[)')) {
        cur.push(current);
        const cEnd = current.start();
        cEnd.add(current.duration());
        if (cEnd.isAfter(curEnd as moment.Moment)) {
          curEnd = cEnd;
        }
        continue;
      }

      res.push(cur);
      cur = [current];
      curEnd = current.start();
      curEnd.add(current.duration());
    }

    if (cur.length) {
      res.push(cur);
    }
    return res;
  }

  public sortEvent(a: Event, b: Event): number {
    if (a.start().isSame(b.start())) {
      return a.duration().asMinutes() - b.duration().asMinutes();
    }
    if (a.start().isBefore(b.start())) {
      return -1;
    }
    return 1;
  }
}
