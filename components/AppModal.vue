<template>
  <el-dialog
    v-model="modelValue"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    :show-close="showClose"
    :align-center="alignCenter"
    :width="width"
    @close="$emit('close')"
  >
    <template #default>
      <slot name="body" />
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    showClose?: boolean
    alignCenter?: boolean
    width?: number
  }>(),
  {
    showClose: false,
    alignCenter: true,
    width: 530
  }
)

defineEmits(['close'])

const modelValue = defineModel<boolean>()
</script>
