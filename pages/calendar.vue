<template>
  <div v-if="loading" class="text-center font-semibold text-gray-500">Loading...</div>

  <div v-else>
    <header class="flex justify-between items-center px-4 py-5">
      <el-button type="primary" size="large" @click="goToToday">Today</el-button>

      <div class="h-20 flex items-center gap-x-4 text-blue-500">
        <button aria-label="Previous Unit" @click="previousUnit">
          <pre class="cursor-pointer text-lg hover:text-blue-600 hover-animation">◀◀</pre>
        </button>

        <p
          class="text-center font-semibold text-xl"
          :class="[currentView === ECalendarViewType.month ? 'w-40' : 'w-60']"
        >
          {{ formattedDate }}
        </p>

        <button aria-label="Next Unit" @click="nextUnit">
          <pre class="cursor-pointer text-lg hover:text-blue-600 hover-animation">▶▶</pre>
        </button>
      </div>

      <el-radio-group v-model="currentView" size="large">
        <el-radio-button :value="ECalendarViewType.month" @click="updateCalendar">Month</el-radio-button>
        <el-radio-button :value="ECalendarViewType.week" @click="updateCurrentWeek">Week</el-radio-button>
      </el-radio-group>
    </header>

    <!-- WEEK DAYS -->
    <WeekDays />

    <!-- DAYS -->
    <div ref="daysContainer" class="grid grid-cols-7 gap-0.5 py-2">
      <!-- MONTH VIEW -->
      <template v-if="currentView === ECalendarViewType.month">
        <MonthView
          :firstDayIndex="firstDayIndex"
          :numberOfDays="numberOfDays"
          :year="year"
          :month="month"
          :selectedDays="selectedDays"
          :getEventsForDay="getEventsForDay"
          :isCurrentDate="isCurrentDate"
          @toggleDaySelection="toggleDaySelection"
          @deleteEvent="handleClickDelete"
        />
      </template>

      <!-- WEEK VIEW -->
      <template v-else>
        <WeekView
          v-for="dayEntity in currentWeekDays"
          :key="dayEntity.day"
          :dayEntity="dayEntity"
          :selectedDays="selectedDays"
          :year="year"
          :isCurrentDate="isCurrentDate"
          :getEventsForDay="getEventsForDay"
          @toggleDaySelection="toggleDaySelection"
          @deleteEvent="handleClickDelete"
        />
      </template>
    </div>

    <div class="flex justify-between gap-2 mt-5">
      <!-- Teleport to navbar -->
      <teleport to="#teleport-selected-days">
        <SelectedDays :days="selectedDays" @removeDay="removeDay" />
      </teleport>

      <div class="flex flex-col gap-2">
        <el-radio-group v-model="excludeType">
          <el-radio value="weekends" @change="excludeDays">Exclude Weekends</el-radio>
          <el-radio value="workdays" @change="excludeDays">Exclude Workdays</el-radio>
        </el-radio-group>

        <div class="flex justify-between">
          <el-button type="danger" :disabled="!selectedDays.length" @click="clearSelection">Clear Selection</el-button>
          <el-button
            type="primary"
            :disabled="!selectedDays.length" @click="visibleCreateEventModal = true"
          >
            Save Selection
          </el-button>
        </div>
      </div>
    </div>
    <CreateEventModal
      v-model="visibleCreateEventModal"
      :selectedDays="selectedDays"
      @clearSelectedDays="clearSelection"
    />
  </div>
</template>

<script lang="ts" setup>
import { ECalendarViewType } from '@/types/enums'
import type { ICalendarEvent } from '@/pages/calendar/calendar'
import { useCalendarService } from './calendar/calendar.service'

definePageMeta({
  pageLabel: 'Calendar',
  navOrder: 1
})

const { deleteSpecificEvent, removeRecurringEvents } = useCalendarService()

const { events } = useCalendarStore()

const loading = ref(true)
const visibleCreateEventModal = ref(false)

const today = new Date()
const date = ref(new Date())
const year = ref(date.value.getFullYear())
const month = ref(date.value.getMonth())
const currentView = ref(ECalendarViewType.month)

const selectedDays = ref<string[]>([])
const currentWeekDays = ref<{ day: number; date: Date; month: number }[]>([])
const excludeType = ref('')

const daysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate()

const firstDayOfMonth = (year: number, month: number): number =>
  new Date(year, month, 1).getDay()

const numberOfDays = ref(daysInMonth(year.value, month.value))
const firstDayIndex = ref(firstDayOfMonth(year.value, month.value))

const formattedDate = ref<string>(
  date.value.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric'
  })
)

const handleClickDelete = (event: ICalendarEvent, year: number, month: number, day: number) => {
  if (event.recurring) {
    openRecurringDeleteConfirm(event, year, month + 1, day)
  } else {
    deleteSpecificEvent(event, year, month + 1, day)
  }
}

const updateCalendar = () => {
  numberOfDays.value = daysInMonth(year.value, month.value)
  firstDayIndex.value = firstDayOfMonth(year.value, month.value)
  formattedDate.value = new Date(year.value, month.value).toLocaleString(
    'en-US',
    {
      month: 'long',
      year: 'numeric'
    }
  )
}

const previousUnit = () => {
  if (currentView.value === ECalendarViewType.month) {
    previousMonth()
  } else {
    previousWeek()
  }
}

const nextUnit = () => {
  if (currentView.value === ECalendarViewType.month) {
    nextMonth()
  } else {
    nextWeek()
  }
}

const previousMonth = () => {
  month.value--
  if (month.value < 0) {
    month.value = 11
    year.value--
  }
  updateCalendar()
}

const nextMonth = () => {
  month.value++
  if (month.value > 11) {
    month.value = 0
    year.value++
  }
  updateCalendar()
}

const isCurrentDate = (day: number): boolean => {
  return (
    year.value === today.getFullYear() &&
    month.value === today.getMonth() &&
    day === today.getDate()
  )
}

const goToToday = () => {
  if (currentView.value === ECalendarViewType.month) {
    year.value = today.getFullYear()
    month.value = today.getMonth()
    updateCalendar()
  } else {
    updateCurrentWeek(new Date())
  }
}

// Week View Logic
const updateCurrentWeek = (weekStartDate?: Date) => {
  const startDate = weekStartDate instanceof Date ? weekStartDate : new Date()

  // Calculate the start of the week based on the provided date
  const startOfWeek = new Date(startDate)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

  updateWeek(startOfWeek)
}

const previousWeek = () => {
  const firstDayOfWeek = new Date(currentWeekDays.value[0].date)
  firstDayOfWeek.setDate(firstDayOfWeek.getDate() - 7)
  updateWeek(firstDayOfWeek)
}

const nextWeek = () => {
  const lastDayOfWeek = new Date(currentWeekDays.value[6].date)
  lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 1)
  updateWeek(lastDayOfWeek)
}

const updateWeek = (startOfWeek: Date): void => {
  const week = []

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    week.push({ day: day.getDate(), date: new Date(day), month: day.getMonth() })
  }

  year.value = week[0].date.getFullYear()
  month.value = week[0].date.getMonth()
  currentWeekDays.value = week

  const firstDay = week[0]
  const lastDay = week[6]

  if (firstDay.month === lastDay.month) {
    formattedDate.value = `${firstDay.day}-${lastDay.day} ${firstDay.date.toLocaleString('en-US', { month: 'long' })} ${firstDay.date.getFullYear()}`
  } else {
    formattedDate.value = `${firstDay.day} ${firstDay.date.toLocaleString('en-US', { month: 'long' })} ${firstDay.date.getFullYear()} - ${lastDay.day} ${lastDay.date.toLocaleString('en-US', { month: 'long' })} ${lastDay.date.getFullYear()}`
  }
}

const removeDay = (selectedDate: string) => {
  selectedDays.value = selectedDays.value.filter(date => date !== selectedDate)
}

// Toggle day selection
const toggleDaySelection = (day: number) => {
  let selectedDate = ''

  if (currentView.value === ECalendarViewType.month) {
    selectedDate = new Date(year.value, month.value, day).toDateString() // Month view
  } else {
    const currentWeekDay = currentWeekDays.value.find(d => d.day === day)
    if (currentWeekDay) {
      selectedDate = currentWeekDay.date.toDateString()
    }
  }

  if (selectedDays.value.includes(selectedDate)) {
    removeDay(selectedDate) // Unselect
  } else {
    selectedDays.value.push(selectedDate) // Select
  }
}

const clearSelection = () => {
  selectedDays.value = []

  if (!selectedDays.value.length) {
    excludeType.value = ''
  }
}

const isWeekend = (date: Date): boolean => {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday or Saturday
}

const excludeDays = () => {
  if (!excludeType.value) return

  selectedDays.value = selectedDays.value.filter((dayStr) => {
    const day = new Date(dayStr)

    if (excludeType.value === 'weekends') {
      return !isWeekend(day) // Keep only workdays
    } else if (excludeType.value === 'workdays') {
      return isWeekend(day) // Keep only weekends
    }
  })

  if (!selectedDays.value.length) {
    excludeType.value = ''
  }
}

const getEventsForDay = (year: number, month: number, day: number) => {
  const yearEvents = events.value[year] || {}
  const monthEvents = yearEvents[month + 1] || {}
  return monthEvents[day] || []
}

const openRecurringDeleteConfirm = (event: ICalendarEvent, year: number, month: number, day: number) => {
  ElMessageBox.confirm(
    'Do you want to permanently delete all recurring items?',
    { confirmButtonText: 'Yes, all', cancelButtonText: 'Only selected event', type: 'warning' })
    .then(() => { removeRecurringEvents(event, year) })
    .catch(() => { deleteSpecificEvent(event, year, month, day) })
}

onMounted(() => {
  loading.value = true
  if (process.client) {
    const storedEvents = localStorage.getItem('events')
    events.value = storedEvents ? JSON.parse(storedEvents) : {}
    loading.value = false
  }
})
</script>

<style lang="scss">
.hover-animation {
  @apply ease-in-out duration-300;
}
</style>
