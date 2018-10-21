import { assign, pick } from 'lodash';
import moment from 'moment';
import axios from 'axios';
import { url, handleErr } from './data';

export interface IEvent {
  startTime: string;
  endTime: string;
  day: string;
  title: string;
  room: string;
  icon?: string;
  id: number;
  schedId: number;
  desc?: string;
  organizer: string;
  hideAgenda?: boolean;
}

export default class Event {
  public startTime = '';
  public endTime = '';
  public title = '';
  public room = '';
  public icon = '';
  public day = '';
  public id: number = -1;
  public schedId: number = -1;
  public organizer = '';
  public desc = '';
  public favorited: boolean | null = null;
  public hideAgenda = false;

  constructor(ev: IEvent) {
    assign(this, ev);
  }

  public start(): moment.Moment {
    const ret = moment(`${this.day} ${this.startTime}`, 'YYYY-MM-DD h:mm A');
    if (ret.hours() <= 3) {
      ret.add(1, 'day');
    }
    return ret;
  }

  public end(): moment.Moment {
    const ret = moment(`${this.day} ${this.endTime}`, 'YYYY-MM-DD h:mm A');
    if (ret.hours() <= 3) {
      ret.add(1, 'day');
    }
    return ret;
  }

  public duration(): moment.Duration {
    return moment.duration(this.end().diff(this.start()));
  }

  public validate(): boolean {
    return !this.start().isAfter(this.end());
  }

  public async save(): Promise<void> {
    try {
      if (this.id === -1) {
        const response = await axios.post(`${url}/events/`, this);
        this.id = response.data;
      } else {
        await axios.put(`${url}/events/${this.id}`, this);
      }
    } catch (e) {
      handleErr(e);
    }
  }

  public async delete(): Promise<void> {
    try {
      await axios.delete(`${url}/events/${this.id}`);
    } catch (e) {
      handleErr(e);
    }
  }
}

export interface EventCol {
  events: Event[][];
  day: Date;
  key(): string;
}
