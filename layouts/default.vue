<template>
  <div class="flex h-full">
    <!-- SIDEBAR -->
    <div class="w-[300px] border-r border-gray-300 flex flex-col">
      <!-- LANG SWITCHER -->
      <div class="h-20 flex items-center justify-center shrink-0 border-b border-gray-300 shadow px-5">
        <client-only>
          <el-select
            v-model="locale"
            @update:modelValue="navigateTo(switchLocalePath(locale))"
          >
            <el-option
              v-for="l in locales"
              :key="l.code"
              :label="l.name"
              :value="l.code"
            />
          </el-select>
        </client-only>
      </div>

      <div class="flex-grow p-5">
        <NuxtLink
          v-for="item in navigation"
          :key="item.label"
          :to="{ name: item.routeName }"
          :class="[
            'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
          ]"
          active-class="bg-gray-100 text-gray-900"
        >
          {{ item.label }}
        </NuxtLink>
      </div>
    </div>

    <div class="flex-grow flex flex-col">
      <!-- HEADER -->
      <div class="shrink-0 flex items-center h-20 bg-white shadow border-b border-gray-300 px-5">
        <Compute
          #default="{ data: {labelClass, pageLabel} }"
          :data="{
            labelClass: 'font-bold text-lg',
            pageLabel: $route.meta?.pageLabel || ''
          }"
        >
          <slot name="header" :labelClass="labelClass" :pageLabel="pageLabel">
            <p :class="labelClass">{{ $t(pageLabel) }}</p>
          </slot>
        </Compute>
      </div>

      <!-- MAIN -->
      <main class="flex-grow p-5">
        <slot />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { locale, locales, t } = useI18n()

const switchLocalePath = useSwitchLocalePath()
const localeRouteName = useLocaleRouteName()

const navigation = computed(() => [
  { label: t('navigation.home'), routeName: localeRouteName('index') },
  { label: t('navigation.about'), routeName: localeRouteName('about') },
  { label: t('navigation.contacts'), routeName: localeRouteName('contacts') }
])
</script>
