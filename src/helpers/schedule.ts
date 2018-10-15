import { assign, pick } from 'lodash';
import { url, handleErr } from './data';
import Event from './event';
import axios from 'axios';
import moment from 'moment';

export interface ISchedule {
  id: number;
  start: string;
  numHours: number;
  dayStart: string;
  dayEnd: string;
  title: string;
  defColor: string;
  colorMap: {[index: string]: string};
}

export default class Schedule {
  public title = '';
  public dayStart: Date = new Date();
  public dayEnd: Date = new Date();
  public id: number = -1;
  public numHours: number = 14;
  public start = '';
  public events: Event[] = [];
  public colorMap: {[index: string]: string} = {};

  constructor(ev: ISchedule) {
    assign(this, pick(ev, ['title', 'id', 'numHours', 'start']));
    this.dayStart = new Date(`${ev.dayStart} ${ev.start}`);
    this.dayEnd = new Date(`${ev.dayEnd} ${ev.start}`);
    if (ev.colorMap) {
      this.colorMap = ev.colorMap;
    }
    this.colorMap.other = ev.defColor;
  }

  public async loadEvents(): Promise<void> {
    if (this.events.length !== 0) { return; }

    try {
      const response = await axios.get(`${url}/${this.id}`);
      for (const item of response.data) {
        this.events.push(new Event(item));
      }


    } catch (e) {
      handleErr(e);
    }
  }

  public dateRange(): Date[] {
    const res: Date[] = [];
    for (const m = moment(this.dayStart); m.isBefore(this.dayEnd); m.add(1, 'day')) {
      res.push(m.toDate());
    }
    res.push(this.dayEnd);
    return res;
  }

  public dateRangeOptions(): Array<{text: string, value: string}> {
    const res: Array<{text: string, value: string}> = [];
    for (const m = moment(this.dayStart); m.isBefore(this.dayEnd); m.add(1, 'day')) {
      res.push({text: m.format('ddd'), value: m.format('YYYY-MM-DD')});
    }
    const last = moment(this.dayEnd);
    res.push({text: last.format('ddd'), value: last.format('YYYY-MM-DD')});
    return res;
  }
}

export async function loadSchedules(): Promise<Schedule[]> {
  const scheds: Schedule[] = [];
  try {
    const resp = await axios.get(url);
    for (const item of resp.data) {
      scheds.push(new Schedule(item));
    }
  } catch (e) {
    handleErr(e);
  }

  return scheds;
}
