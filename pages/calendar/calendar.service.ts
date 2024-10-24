import type { ICalendarEvent, IEventDetails } from './calendar'

export function useCalendarService () {
  const { events } = useCalendarStore()

  function setEventsInLocalStorage (newEvents: ICalendarEvent) {
    events.value = newEvents
    localStorage.setItem('events', JSON.stringify(newEvents))
  }

  function saveEventToLocalStorage (eventDetails: IEventDetails, selectedDays: string[]) {
    // Parse the date strings into Date objects
    const dates: Date[] = selectedDays.map(dateString => new Date(dateString))

    if (dates.length === 0) return

    // Retrieve existing events from localStorage
    const existingEvents = JSON.parse(localStorage.getItem('events') || '{}')

    // Loop through selected days and save the event
    dates.forEach(day => {
      const year = day.getFullYear()
      const month = day.getMonth() + 1
      const dayOfMonth = day.getDate()

      const event = {
        comment: eventDetails.comment,
        id: `${eventDetails.comment}-${Date.now()}`,
        recurring: eventDetails.recurring,
        type: eventDetails.type
      }

      if (eventDetails.recurring) {
        // Save the event for all months until the end of the year
        for (let m = month; m <= 12; m++) {
          if (!existingEvents[year]) {
            existingEvents[year] = {}
          }
          if (!existingEvents[year][m]) {
            existingEvents[year][m] = {}
          }
          if (!existingEvents[year][m][dayOfMonth]) {
            existingEvents[year][m][dayOfMonth] = []
          }
          existingEvents[year][m][dayOfMonth].push(event)
        }
      } else {
        // Save only for the specific date's year and month
        if (!existingEvents[year]) {
          existingEvents[year] = {}
        }
        if (!existingEvents[year][month]) {
          existingEvents[year][month] = {}
        }
        if (!existingEvents[year][month][dayOfMonth]) {
          existingEvents[year][month][dayOfMonth] = []
        }
        existingEvents[year][month][dayOfMonth].push(event)
      }
    })

    events.value = existingEvents
    setEventsInLocalStorage(existingEvents)
  }

  function deleteSpecificEvent (event: ICalendarEvent, year: number, month: number, day: number) {
    const dayEvents = events.value[year]?.[month]?.[day]
    if (!dayEvents) return

    const eventIndex = dayEvents.findIndex((e: ICalendarEvent) => e.id === event.id)
    if (eventIndex === -1) return

    dayEvents.splice(eventIndex, 1)

    if (!dayEvents.length) {
      delete events.value[year][month][day]

      if (!Object.keys(events.value[year][month]).length) {
        delete events.value[year][month]

        if (!Object.keys(events.value[year]).length) {
          delete events.value[year]
        }
      }
    }

    setEventsInLocalStorage(events.value)
  }

  function removeRecurringEvents (event: ICalendarEvent, year: number) {
    const yearData = events.value[year]
    if (!yearData) return events.value

    Object.keys(yearData).forEach((month) => {
      Object.keys(yearData[month]).forEach((day) => {
        yearData[month][day] = yearData[month][day].filter((item: ICalendarEvent) => item.id !== event.id)

        if (!yearData[month][day].length) delete yearData[month][day]
      })

      if (!Object.keys(yearData[month]).length) delete yearData[month]
    })

    if (!Object.keys(yearData).length) delete events.value[year]

    setEventsInLocalStorage(events.value)
  }

  function getEventsForDay (year: number, month: number, day: number) {
    const yearEvents = events.value[year] || {}
    const monthEvents = yearEvents[month + 1] || {}
    return monthEvents[day] || []
  }

  function isCurrentDate (day: number, year: number, month: number): boolean {
    const today = new Date()

    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    )
  }

  function isWeekend (date: Date): boolean {
    const day = date.getDay()
    return day === 0 || day === 6 // Sunday or Saturday
  }

  function excludeDays (selectedDays: string[], excludeType: string): string[] {
    if (!excludeType) return selectedDays

    return selectedDays.filter((dayStr) => {
      const day = new Date(dayStr)

      if (excludeType === 'weekends') {
        return !isWeekend(day) // Keep only workdays
      } else if (excludeType === 'workdays') {
        return isWeekend(day) // Keep only weekends
      }
    })
  }

  return {
    saveEventToLocalStorage,
    deleteSpecificEvent,
    removeRecurringEvents,
    getEventsForDay,
    isCurrentDate,
    isWeekend,
    excludeDays
  }
}
