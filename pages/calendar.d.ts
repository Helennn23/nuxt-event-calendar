export interface IEventDetails {
  comment: string
  type: string
  recurring: boolean
}

export interface ICalendarEvent extends IEventDetails {
  id: string
}

export type TEvents = Record<number, Record<number, ICalendarEvent[]>>
