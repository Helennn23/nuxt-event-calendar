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
              isCurrentDate(day)
                ? 'bg-blue-100 text-blue-800 hover:text-blue-500 hover-animation'
                : 'hover:bg-gray-100 hover:text-blue-500 hover-animation',
              selectedDays.includes(new Date(year, month, day).toDateString()) ? 'bg-green-100' : ''
            ]"
            @click="toggleDaySelection(day)"
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
              isCurrentDate(day.day)
                ? 'bg-blue-100 text-blue-800 hover:text-blue-500 hover-animation'
                : 'hover:bg-gray-100 hover:text-blue-500 hover-animation',
              selectedDays.includes(day.date.toDateString()) ? 'bg-green-100' : ''
            ]"

            @click="toggleDaySelection(day.day)"
          >
            {{ day.day }}
          </div>
        </template>
      </div>

      <div class="flex justify-between mt-4">
        <el-button type="danger" @click="clearSelection">Clear Selection</el-button>
        <el-button type="primary" @click="saveSelection">Save Selection</el-button>
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
const currentView = ref(ECalendarViewType.month)

const selectedDays = ref<string[]>([])

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

  // Calculate the start of the week based on the provided date
  const startOfWeek = new Date(startDate)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

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

// Toggle day selection
const toggleDaySelection = (day: number): void => {
  let selectedDate = ''
  if (currentView.value === ECalendarViewType.month) {
    selectedDate = new Date(year.value, month.value, day).toDateString() // Month view
  } else {
    const currentWeekDay = currentWeekDays.value.find(d => d.day === day)
    if (currentWeekDay) {
      selectedDate = currentWeekDay.date.toDateString() // Week view, use the full date
    }
  }

  if (selectedDays.value.includes(selectedDate)) {
    selectedDays.value = selectedDays.value.filter(date => date !== selectedDate) // Unselect
  } else {
    selectedDays.value.push(selectedDate) // Select
  }
}

const clearSelection = () => {
  selectedDays.value = []
}

const saveSelection = () => {
  console.log('Selected Days:', selectedDays.value)
}
</script>

<style lang="scss">
.hover-animation {
  @apply ease-in-out duration-150;
}
</style>
