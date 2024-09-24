<template>
  <div>
    <div>
      <header class="flex justify-between items-center px-4 py-5">
        <button class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 hover-animation" @click="goToToday">
          Today
        </button>

        <div class="flex gap-x-4 text-blue-500">
          <pre class="cursor-pointer text-lg hover:text-blue-600 hover-animation" @click="previousMonth">◀◀</pre>
          <p class="w-40 text-center text-xl font-semibold">{{ formattedDate }}</p>
          <pre class="cursor-pointer text-lg hover:text-blue-600 hover-animation" @click="nextMonth">▶▶</pre>
        </div>

        <el-radio-group v-model="monthWeekView" size="large">
          <el-radio-button label="Month" value="Month" />
          <el-radio-button label="Week" value="Week" />
        </el-radio-group>
      </header>

      <!-- WEEK -->
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
        <div v-for="blank in firstDayIndex" :key="blank" />
        <div
          v-for="day in numberOfDays"
          :key="day"
          :class="['flex justify-end items-start pr-2 h-16 text-gray-600 cursor-pointer border',
                   isCurrentDate(day)
                     ? 'bg-blue-100 text-blue-400 hover-animation'
                     : '', 'hover:bg-gray-100 hover:text-blue-500 hover-animation']"
          @click="selectDate(day)"
        >
          {{ day }}
        </div>
      </div>
    </div>

    <div class="py-4">
      <p class="ml-5 font-semibold text-gray-600">Selected Date:</p>
      <span class="text-gray-600 text-sm">✅ {{ selectedDate || 'None' }} </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  pageLabel: 'Calendar',
  navOrder: 1
})

const date = ref(new Date())
const year = ref(date.value.getFullYear())
const month = ref(date.value.getMonth())
const selectedDate = ref<string | null>(null)

const monthWeekView = ref('Month')

const daysContainer = ref<HTMLElement | null>(null)

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

const previousMonth = (): void => {
  month.value--
  if (month.value < 0) {
    month.value = 11
    year.value--
  }
  updateCalendar()
  selectedDate.value = null
}

const nextMonth = (): void => {
  month.value++
  if (month.value > 11) {
    month.value = 0
    year.value++
  }
  updateCalendar()
  selectedDate.value = null
}

const isCurrentDate = (day: number): boolean => {
  const today = new Date()
  return (
    year.value === today.getFullYear() &&
    month.value === today.getMonth() &&
    day === today.getDate()
  )
}

const selectDate = (day: number): void => {
  selectedDate.value = new Date(year.value, month.value, day).toDateString()
}

const goToToday = (): void => {
  const today = new Date()
  year.value = today.getFullYear()
  month.value = today.getMonth()
  updateCalendar()
}
</script>

<style lang="scss">
.hover-animation {
  @apply ease-in-out duration-300;
}
</style>
