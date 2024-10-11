<template>
  <div>
    <h3 class="font-medium opacity-50 mb-3">Selected days:</h3>
    <ul class="max-h-[600px] overflow-y-scroll space-y-2">
      <li v-for="day in days" :key="day">
        <el-button class="mr-3" type="danger" :icon="Delete" circle @click=" emit('removeDay', day)" />
        {{ day }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { Delete } from '@element-plus/icons-vue'

defineProps<{
  days: string[]
}>()

const emit = defineEmits(['removeDay'])
</script>
