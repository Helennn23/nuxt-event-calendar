import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import type { Plugin } from 'vite'

import {
  defineNuxtModule,
  addVitePlugin
} from '@nuxt/kit'

export default defineNuxtModule({
  setup () {
    addVitePlugin([
      Icons({
        compiler: 'vue3',
        customCollections: {
          icon: FileSystemIconLoader('./assets/icons')
        },
        autoInstall: true
      }) as Plugin,

      Components({
        dts: 'dts/components.d.ts',
        dirs: [],
        resolvers: [
          IconsResolver({
            prefix: 'app',
            customCollections: ['icon']
          })
        ]
      })
    ])
  }
})
