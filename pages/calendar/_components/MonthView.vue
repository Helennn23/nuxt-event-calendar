<template>
  <div v-for="blank in firstDayIndex" :key="blank" />

  <div
    v-for="day in numberOfDays"
    :key="day"
    :class="[
      'relative flex flex-col justify-start items-end h-16 text-gray-600 cursor-pointer border',
      isCurrentDate(day, props.year, month)
        ? 'bg-blue-100 text-blue-800 hover:text-blue-500 hover-animation'
        : 'hover:bg-gray-100 hover:text-blue-500 hover-animation',
    ]"
    @click="emit('toggleDaySelection', day)"
  >
    <p class="place-self-center">{{ day }}</p>
    <AppIconCheck
      v-if="selectedDays.includes(new Date(year, month, day).toDateString())"
      class="absolute top-0 right-0 cursor-pointer"
    />

    <!-- Events -->
    <div class="w-full overflow-y-auto max-h-12">
      <div
        v-for="event in getEventsForDay(year, month, day)"
        :key="event.id"
        :class="['flex justify-between items-center pl-2 text-xs', eventColors[event.type]]"
      >
        <p class="truncate">{{ event.comment }}</p>
        <button @click.stop="emit('deleteEvent', event, year, month, day)">
          <AppIconDelete />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCalendarService } from '@/pages/calendar/calendar.service'
import { eventColors } from '@/pages/calendar/calendar.config'

const { getEventsForDay, isCurrentDate } = useCalendarService()

const props = defineProps<{
  firstDayIndex: number
  numberOfDays: number
  year: number
  month: number
  selectedDays: string[]
}>()

const emit = defineEmits(['toggleDaySelection', 'deleteEvent'])
</script>
