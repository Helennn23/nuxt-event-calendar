import { buildComponentsAutoImports, buildScriptsAutoImports } from './runtime/imports'

import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  hooks: {
    'components:dirs': buildComponentsAutoImports,
    'imports:extend': buildScriptsAutoImports
  }
})
