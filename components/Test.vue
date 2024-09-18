<template>
  <div>{{ testVal }}</div>
</template>

<script lang="ts" setup>
function testFn () {
  testVal.value = 'updated test val via ref function'
}

const testVal = ref('test val')

defineExpose({
  testFn
})
</script>
