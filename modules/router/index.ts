import { buildRouter } from './runtime/router-builder'
import {
  defineNuxtModule
} from '@nuxt/kit'

export default defineNuxtModule({
  hooks: {
    'pages:extend': buildRouter
  }
})
