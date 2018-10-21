
export const url = process.env.VUE_APP_BACKEND || '';

export interface IDataHeader {
  text: string;
  align?: string;
  sortable?: boolean;
  value?: string;
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
    text: 'Duration',
    sortable: false,
  },
  {
    text: 'Room',
    value: 'room',
    sortable: true,
  },
  {
    text: 'Icon',
    value: 'icon',
    sortable: false,
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
