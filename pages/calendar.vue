<template>
  <div>
    <div>
      <header class="flex justify-between items-center px-4 py-5">
        <el-button type="primary" size="large" @click="goToToday">Today</el-button>

        <div class="flex gap-x-4 text-blue-500">
          <pre class="cursor-pointer text-lg hover:text-blue-600 hover-animation" @click="previousUnit">◀◀</pre>
          <p class="w-40 text-center text-xl font-semibold">{{ formattedDate }}</p>
          <pre class="cursor-pointer text-lg hover:text-blue-600 hover-animation" @click="nextUnit">▶▶</pre>
        </div>

        <el-radio-group v-model="currentView" size="large">
          <el-radio-button label="Month" :value="ECalendarViewType.month" />
          <el-radio-button label="Week" :value="ECalendarViewType.week" @click="updateCurrentWeek" />
        </el-radio-group>
      </header>

      <div class="grid grid-cols-7 gap-1 font-medium opacity-50 text-center">
        <p>Sunday</p>
        <p>Monday</p>
        <p>Tuesday</p>
        <p>Wednesday</p>
        <p>Thursday</p>
        <p>Friday</p>
        <p>Saturday</p>
      </div>

      <!-- DAYS -->
      <div ref="daysContainer" class="grid grid-cols-7 gap-0.5 py-2">
        <!-- MONTH VIEW -->
        <template v-if="currentView === ECalendarViewType.month">
          <div v-for="blank in firstDayIndex" :key="blank" />
          <div
            v-for="day in numberOfDays"
            :key="day"
            :class="[
              'flex justify-end items-start pr-2 h-16 text-gray-600 cursor-pointer border',
              isCurrentDate(day) ? 'bg-blue-100 text-blue-400 hover-animation' : '',
              isInRange( new Date(year, month, day)) ? 'bg-green-500 hover-animation' : '',
            ]"
            @click="selectRangeDate(new Date(year, month, day))"
          >
            {{ day }}
          </div>
        </template>

        <!-- WEEK VIEW -->
        <template v-else>
          <div
            v-for="day in currentWeekDays"
            :key="day.day"
            :class="[
              'flex justify-end items-start pr-2 h-16 text-gray-600 cursor-pointer border',
              isCurrentDate(day.day) ? 'bg-blue-100 text-blue-400 hover-animation' : '',
              isInRange(day.date) ? 'bg-green-500 hover-animation' : '',
            ]"
            @click="selectRangeDate(day.date)"
          >
            {{ day.day }}
          </div>
        </template>
      </div>
    </div>

    <!-- Range Selection Buttons -->
    <div class="py-4 flex justify-between">
      <div class="ml-5">
        <p class="font-semibold text-gray-600">Selected Range:</p>
        <span class="text-gray-600 text-sm">
          {{ formattedRange || 'N/A' }}
        </span>
      </div>
      <div>
        <el-button type="danger" @click="clearRange">Clear Range</el-button>
        <el-button type="primary" @click="saveRange">Save Range</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ECalendarViewType } from '@/types/enums'

definePageMeta({
  pageLabel: 'Calendar',
  navOrder: 1
})

const today = new Date()

const date = ref(new Date())
const year = ref(date.value.getFullYear())
const month = ref(date.value.getMonth())
const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)
const savedRange = ref<{ start: Date | null; end: Date | null }>({ start: null, end: null })
const currentView = ref(ECalendarViewType.month)
const formattedRange = computed(() =>
  startDate.value && endDate.value
    ? `${startDate.value.toDateString()} - ${endDate.value.toDateString()}`
    : startDate.value
      ? startDate.value.toDateString()
      : null
)

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

const updateCalendar = (): void => {
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

const previousUnit = (): void => {
  if (currentView.value === ECalendarViewType.month) {
    previousMonth()
  } else {
    previousWeek()
  }
}

const nextUnit = (): void => {
  if (currentView.value === ECalendarViewType.month) {
    nextMonth()
  } else {
    nextWeek()
  }
}

const previousMonth = (): void => {
  month.value--
  if (month.value < 0) {
    month.value = 11
    year.value--
  }
  updateCalendar()
}

const nextMonth = (): void => {
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

// Highlight if a day is selected or is within the range
const isInRange = (dateObj: Date): boolean => {
  if (!startDate.value && !endDate.value) return false

  const current = dateObj
  if (endDate.value && startDate.value) {
    return current >= startDate.value && current <= endDate.value
  }
  return current.getTime() === startDate.value?.getTime()
}

// Select start and end dates
const selectRangeDate = (dateObj: Date): void => {
  const selected = dateObj

  if (!startDate.value) {
    startDate.value = selected
  } else if (!endDate.value) {
    if (selected < startDate.value) {
      endDate.value = startDate.value
      startDate.value = selected
    } else {
      endDate.value = selected
    }
  } else {
    startDate.value = selected
    endDate.value = null
  }
}

const clearRange = (): void => {
  startDate.value = null
  endDate.value = null
}

const saveRange = (): void => {
  savedRange.value = { start: startDate.value, end: endDate.value }
  console.log('Saved Range:', savedRange.value)
}

const goToToday = (): void => {
  if (currentView.value === ECalendarViewType.month) {
    year.value = today.getFullYear()
    month.value = today.getMonth()
    updateCalendar()
  } else {
    updateCurrentWeek(new Date())
  }
}

// Week View Logic
const currentWeekDays = ref<{ day: number; date: Date }[]>([])

const updateCurrentWeek = (weekStartDate?: Date): void => {
  const startDate = weekStartDate instanceof Date ? weekStartDate : new Date()

  const startOfWeek = new Date(startDate.setDate(startDate.getDate() - startDate.getDay()))
  updateWeek(startOfWeek)
}

const previousWeek = (): void => {
  const firstDayOfWeek = new Date(currentWeekDays.value[0].date)
  firstDayOfWeek.setDate(firstDayOfWeek.getDate() - 7)
  updateWeek(firstDayOfWeek)
}

const nextWeek = (): void => {
  const lastDayOfWeek = new Date(currentWeekDays.value[6].date)
  lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 1)
  updateWeek(lastDayOfWeek)
}

const updateWeek = (startOfWeek: Date): void => {
  const week = []

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    week.push({ day: day.getDate(), date: new Date(day) })
  }

  // Update month if switching between months
  year.value = week[0].date.getFullYear()
  month.value = week[0].date.getMonth()
  currentWeekDays.value = week
  formattedDate.value = new Date(year.value, month.value).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric'
  })
}
</script>
