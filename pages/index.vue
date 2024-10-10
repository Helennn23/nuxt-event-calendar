<template>
  <div>
    <h1 class="text-3xl text-gray-700 font-bold mb-4">Nuxt Event Calendar 🦎🐊</h1>
    <p class="text-md text-gray-600 mb-6">
      A customizable event calendar built with Nuxt 3 that allows users to select days,
      switch between week and month views, and manage events with various features like recurring events,
      local storage integration, and color-coded event types.
    </p>

    <!-- Feature Section -->
    <section class="mb-6">
      <h2 class="text-xl text-gray-700 font-semibold mb-2">Features:</h2>
      <ul class="text-gray-600 list-disc list-inside">
        <li v-for="(feature, index) in features" :key="index">
          <strong>{{ feature.title }}:</strong> {{ feature.description }}
        </li>
      </ul>
    </section>

    <!-- Calendar Component Placeholder -->
    <div class="bg-white shadow-md rounded-lg p-4">
      <div class="flex justify-between items-center mb-4">
        <!-- View Toggle (Week/Month) -->
        <div>
          <button class="bg-blue-700 text-white py-1 px-3 rounded hover:bg-blue-600 mr-2">Week View</button>
          <button class="bg-blue-700 text-white py-1 px-3 rounded hover:bg-blue-600">Month View</button>
        </div>

        <!-- Weekend/Weekday Selection -->
        <div>
          <button class="bg-green-700 text-white py-1 px-3 rounded hover:bg-green-600 mr-2">Exclude Weekends</button>
          <button class="bg-green-700 text-white py-1 px-3 rounded hover:bg-green-600">Exclude Weekdays</button>
        </div>
      </div>

      <!-- Calendar Grid (Placeholder) -->
      <div class="grid grid-cols-7 gap-2">
        <!-- Example of a day block -->
        <div class="bg-gray-200 h-32 flex flex-col justify-between p-2 rounded">
          <div class="text-sm font-semibold text-center text-gray-600">1</div>
          <div class="mt-2 space-y-1">
            <span class="block bg-red-500 text-white text-xs rounded p-1">Event 1</span>
            <span class="block bg-yellow-500 text-white text-xs rounded p-1">Event 2</span>
            <span class="block bg-blue-500 text-white text-xs rounded p-1">Event 3</span>
          </div>
        </div>
      </div>

      <div class="mt-4 flex justify-between">
        <button class="bg-red-900 text-white py-2 px-4 rounded hover:bg-red-800">Clear Selection</button>
        <button class="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-600">Save Selection</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  pageLabel: 'Description',
  navOrder: 2
})

const features = [
  {
    title: 'Weekend/Weekday Selection',
    description: 'Select either weekends or weekdays, automatically clearing non-selected day types.'
  },
  {
    title: 'Views',
    description: 'Switch between week and month views of the calendar.'
  },
  {
    title: 'Select/Deselect Days',
    description: 'Allow users to pick and unpick days on the calendar.'
  },
  {
    title: 'Add/Delete Events',
    description: 'Events can be added or removed based on selected days (Events are limited to weekends, weekdays, or both).'
  },
  {
    title: 'Event Colors',
    description: 'Each event type has a designated color: "Available for Both" events are yellow, "Events available only for weekdays" are green, and "Events available only for weekends" are blue.'
  },
  {
    title: 'LocalStorage Support',
    description: 'All events are saved in LocalStorage to persist across sessions.'
  },
  {
    title: 'Recurring Events',
    description: 'Add/Delete events that repeat monthly on specific dates (e.g., 2nd, 31st).'
  }
]
</script>
