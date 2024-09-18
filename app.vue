<template>
  <ElConfigProvider
    :locale="{
      name: locale,
      el: messages[locale]?.el as TranslatePair
    }"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ElConfigProvider>
</template>
<script lang="ts" setup>
import type { TranslatePair } from 'element-plus/lib/locale'

const { locale, messages } = useI18n()
</script>
