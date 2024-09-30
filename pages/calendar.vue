<template>
  <div>
    <header class="flex justify-between items-center px-4 py-5">
      <el-button type="primary" size="large" @click="goToToday">Today</el-button>

      <div class="flex gap-x-4 text-blue-500">
        <pre class="cursor-pointer text-lg hover:text-blue-600 hover-animation" @click="previousUnit">◀◀</pre>
        <p class="w-40 text-center text-xl font-semibold">{{ formattedDate }}</p>
        <pre class="cursor-pointer text-lg hover:text-blue-600 hover-animation" @click="nextUnit">▶▶</pre>
      </div>

      <el-radio-group v-model="currentView" size="large">
        <el-radio-button :value="ECalendarViewType.month">Month</el-radio-button>
        <el-radio-button :value="ECalendarViewType.week" @click="updateCurrentWeek">Week</el-radio-button>
      </el-radio-group>
    </header>

    <!-- WEEK DAYS -->
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
            'relative flex justify-end items-start pr-2 h-16 text-gray-600 cursor-pointer border',
            isCurrentDate(day)
              ? 'bg-blue-100 text-blue-800 hover:text-blue-500 hover-animation'
              : 'hover:bg-gray-100 hover:text-blue-500 hover-animation',
          ]"
          @click="toggleDaySelection(day)"
        >
          <span>{{ day }}</span>
          <AppIconCheck
            v-if=" selectedDays.includes(new Date(year, month, day).toDateString())"
            class="absolute top-[30%] right-[45%] cursor-pointer"
          />
        </div>
      </template>

      <!-- WEEK VIEW -->
      <template v-else>
        <div
          v-for="day in currentWeekDays"
          :key="day.day"
          :class="[
            'relative flex justify-end items-start pr-2 h-16 text-gray-600 cursor-pointer border',
            isCurrentDate(day.day)
              ? 'bg-blue-100 text-blue-800 hover:text-blue-500 hover-animation'
              : 'hover:bg-gray-100 hover:text-blue-500 hover-animation',
          ]"

          @click="toggleDaySelection(day.day)"
        >
          <span>{{ day.day }}</span>
          <AppIconCheck
            v-if="selectedDays.includes(day.date.toDateString())"
            class="absolute top-[30%] right-[45%] cursor-pointer"
          />
        </div>
      </template>
    </div>

    <div class="flex justify-between gap-2 mt-5">
      <div>
        <h3 class="font-medium opacity-50 mb-3">Selected days:</h3>
        <ul class="space-y-2">
          <li v-for="day in selectedDays" :key="day">
            <el-button class="mr-3" type="danger" :icon="Delete" circle @click="removeDay(day)" />
            {{ day }}
          </li>
        </ul>
      </div>

      <div class="flex flex-col gap-2">
        <el-radio-group v-model="excludeType">
          <el-radio value="weekends" @change="excludeDays">Exclude Weekends</el-radio>
          <el-radio value="workdays" @change="excludeDays">Exclude Workdays</el-radio>
        </el-radio-group>

        <div class="flex justify-between">
          <el-button type="danger" :disabled="!selectedDays.length" @click="clearSelection">Clear Selection</el-button>
          <el-button type="primary" :disabled="!selectedDays.length" @click="saveSelection">Save Selection</el-button>
        </div>
      </div>
    </div>
  </div>

  <el-dialog
    v-model="dialogVisible"
    title="Add event"
    width="500"
    :destroy-on-close="true"
    :show-close="false"
  >
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      status-icon
    >
      <el-form-item label="Comment" prop="comment">
        <el-input v-model="ruleForm.comment" placeholder="Please add comment" />
      </el-form-item>

      <el-form-item label="Type" prop="type">
        <el-select v-model="ruleForm.type" placeholder="Please select event type">
          <el-option label="Vacation" value="vacation" />
          <el-option label="Sick leave" value="sick leave" />
          <el-option label="Day off" value="day off" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-checkbox v-model="ruleForm.recurring">
          Recurring event
        </el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-button @click="handleClose()">Cancel</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          Create
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Delete } from '@element-plus/icons-vue'
import { ECalendarViewType } from '@/types/enums'
import type { FormInstance, FormRules } from 'element-plus'

definePageMeta({
  pageLabel: 'Calendar',
  navOrder: 1
})

const dialogVisible = ref(false)

const today = new Date()

const date = ref(new Date())
const year = ref(date.value.getFullYear())
const month = ref(date.value.getMonth())
const currentView = ref(ECalendarViewType.month)

const selectedDays = ref<string[]>([])
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

const removeDay = (selectedDate: string) => {
  selectedDays.value = selectedDays.value.filter(date => date !== selectedDate)
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

const saveSelection = () => {
  dialogVisible.value = true
  localStorage.setItem('selectedDays', JSON.stringify(selectedDays.value))
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

const handleClose = () => {
  dialogVisible.value = false
  // TODO refactor move to component or to function
  ruleForm.comment = ''
  ruleForm.type = ''
  ruleForm.recurring = false
}

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  comment: '',
  type: '',
  recurring: false
})

const rules = reactive<FormRules>({
  comment: { required: true, message: 'Please add comment', trigger: 'change' },
  type: { required: true, message: 'Please select event type', trigger: 'change' }
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate((valid) => {
    if (valid) {
      ruleForm.comment = ''
      ruleForm.type = ''
      ruleForm.recurring = false
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.hover-animation {
  transition: all 0.2s;
}
</style>
