
const devUrl = 'http://localhost:8090';
const prodUrl = 'http://knk-backend.herokuapp.com';
export const url = process.env.NODE_ENV === 'development' ? devUrl : prodUrl;

export interface IDataHeader {
  text: string;
  align?: string;
  sortable?: boolean;
  value: string;
}

export const EventHeaders: IDataHeader[] = [
  {
    text: 'Name',
    align: 'left',
    sortable: true,
    value: 'title',
  },
  {
    text: 'Day',
    value: 'day',
    sortable: false,
  },
  {
    text: 'Organizer',
    value: 'organizer',
    sortable: true,
  },
  {
    text: 'Start',
    value: 'start',
    sortable: true,
  },
  {
    text: 'End',
    value: 'end',
    sortable: true,
  },
  {
    text: 'Room',
    value: 'room',
    sortable: true,
  },
  {
    text: '',
    value: 'name',
    sortable: false,
  },
];

export const SchedHeaders: IDataHeader[] = [
  {
    text: 'Title',
    align: 'left',
    sortable: true,
    value: 'title',
  },
  {
    text: 'Start',
    value: 'dayStart',
    sortable: false,
  },
  {
    text: 'End',
    value: 'dayEnd',
    sortable: false,
  },
];

export function handleErr(e: Error) {
  // console.log(e);
}
