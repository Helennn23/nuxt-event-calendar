<template>
  <div>
    <AboutComponent />

    <AppIconAlert />
    <AppIconEyeTest class="text-primary hover:text-black cursor-pointer" />
    <AppIconKnife class="w-7 text-primary hover:text-black cursor-pointer" />

    <div>
      <p>{{ $t('general.welcome') }}</p>

      <p>{{ aboutVar }}</p>
      <el-button
        type="primary"
        @click="changeAboutVar('changed var')"
      >
        Change about var
      </el-button>
    </div>

    <div class="space-x-5">
      <NuxtLink
        v-for="item in innerNavigation"
        :key="item.name"
        active-class="text-primary"
        class="hover:text-primary hover:underline"
        :to="{ name: item.name }"
      >
        {{ item.meta?.pageLabel }}
      </NuxtLink>
    </div>

    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  pageLabel: 'navigation.about',
  navOrder: 2
})

const route = useRoute()

const innerNavigation = computed(() => {
  return route.matched[0].children.map(({ name, meta }) => ({
    name: name as TRouteNamedMapKeys,
    meta
  }))
})

const { aboutVar, changeAboutVar } = useAboutStore()
</script>
