import type { NuxtPage } from '@nuxt/schema'

// Parses pages folder and recursively ignores all files placed in /components dirs.
function parseRoutes (routes: NuxtPage[]) {
  for (let i = routes.length - 1; i >= 0; i--) {
    const route = routes[i]
    if (['/_components/', '.ts'].some(ext => route.file?.includes(ext))) {
      routes.splice(i, 1)
    }

    parseRoutes(route.children || [])
  }
}

// Builds routes and generates route names
function buildRouter (routes: NuxtPage[]) {
  console.info('Generating routes')
  parseRoutes(routes)
  console.info('Warming up vite clients...')
}

export {
  buildRouter
}
