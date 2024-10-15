<template>
  <AppModal
    v-model="modalVisible"
    :width="550"
    title="Add event"
    :destroyOnClose="true"
    @close="modalVisible = false"
  >
    <template #body>
      <el-form
        ref="ruleFormRef"
        :model="eventDetails"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="Comment" prop="comment">
          <el-input v-model="eventDetails.comment" placeholder="Please add comment" />
        </el-form-item>

        <el-form-item label="Type" prop="type">
          <el-select v-model="eventDetails.type" placeholder="Please select event type">
            <template v-for="group in filteredOptions" :key="group.label">
              <el-option-group :label="group.label">
                <el-option
                  v-for="option in group.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-option-group>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="eventDetails.recurring">
            Monthly recurring event
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button @click="handleClose">Cancel</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            Create
          </el-button>
        </el-form-item>
      </el-form>
    </template>
  </AppModal>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { useCalendarService } from '../calendar.service'

const { saveEventToLocalStorage } = useCalendarService()

const props = defineProps<{
  selectedDays: string[]
}>()

const emit = defineEmits(['clearSelectedDays'])

const modalVisible = defineModel<boolean>()

const ruleFormRef = ref<FormInstance>()

const eventDetails = reactive({
  comment: '',
  type: '',
  recurring: false
})

const rules = reactive<FormRules>({
  comment: { required: true, message: 'Please add comment', trigger: 'change' },
  type: { required: true, message: 'Please select event type', trigger: 'change' }
})

const resetEventDetails = () => {
  eventDetails.comment = ''
  eventDetails.type = ''
  eventDetails.recurring = false
}

const handleClose = () => {
  modalVisible.value = false
  resetEventDetails()
}

const isWeekend = (date: string) => {
  const dayOfWeek = new Date(date).getDay()
  return dayOfWeek === 6 || dayOfWeek === 0
}

const filteredOptions = computed(() => {
  const hasWeekend = props.selectedDays.some(day => isWeekend(day))
  const hasWeekday = props.selectedDays.some(day => !isWeekend(day))

  const options = []

  if (hasWeekend && hasWeekday) {
    options.push({
      label: 'Available for Both',
      options: [
        { label: 'Holiday', value: 'holiday' },
        { label: 'Birthday', value: 'birthday' },
        { label: 'Vacation', value: 'vacation' }
      ]
    })
  } else {
    if (hasWeekend) {
      options.push({
        label: 'Weekends Only',
        options: [
          { label: 'Family Gathering', value: 'family-gathering' },
          { label: 'Weekend Trip', value: 'weekend-trip' }
        ]
      })
      options.push({
        label: 'Available for Both',
        options: [
          { label: 'Holiday', value: 'holiday' },
          { label: 'Birthday', value: 'birthday' },
          { label: 'Vacation', value: 'vacation' }
        ]
      })
    }

    if (hasWeekday) {
      options.push({
        label: 'Weekdays Only',
        options: [
          { label: 'Work Meeting', value: 'work-meeting' },
          { label: 'Day Off', value: 'day-off' },
          { label: 'Workshop', value: 'workshop' },
          { label: 'Sick leave', value: 'sick leave' }
        ]
      })
      options.push({
        label: 'Available for Both',
        options: [
          { label: 'Holiday', value: 'holiday' },
          { label: 'Birthday', value: 'birthday' },
          { label: 'Vacation', value: 'vacation' }
        ]
      })
    }
  }

  return options
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      saveEventToLocalStorage(eventDetails, props.selectedDays)
      resetEventDetails()
      modalVisible.value = false
      emit('clearSelectedDays')
    }
  })
}
</script>
