<template>
  <div
    :class="[
      'relative flex flex-col justify-start items-end h-80 text-gray-600 cursor-pointer border',
      isCurrentDate(dayEntity.day)
        ? 'bg-blue-100 text-blue-800 hover:text-blue-500 hover-animation'
        : 'hover:bg-gray-100 hover:text-blue-500 hover-animation',
    ]"
    @click="emits('toggleDaySelection', dayEntity.day)"
  >
    <p class="place-self-center">{{ dayEntity.day }}</p>

    <AppIconCheck
      v-if="selectedDays.includes(dayEntity.date.toDateString())"
      class="absolute top-0 right-0 cursor-pointer"
    />

    <div class="w-full overflow-y-auto max-h-80">
      <div
        v-for="event in getEventsForDay(year, dayEntity.month, dayEntity.day)" :key="event.id"
        :class="['flex justify-between items-center w-full pl-2 text-xs', eventColors[event.type]]"
      >
        <p class="truncate">{{ event.comment }}</p>
        <button @click.stop="emits('deleteEvent', event, year, dayEntity.month,dayEntity.day )">
          <AppIconDelete />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { eventColors } from '@/pages/calendar/calendar.config'

defineProps<{
  dayEntity: { day: number; date: Date; month: number }
  selectedDays: string[]
  year: number
  isCurrentDate: (day: number) => boolean
  getEventsForDay: (year: number, month: number, day: number) => any[]
}>()

const emits = defineEmits(['deleteEvent', 'toggleDaySelection'])
</script>
