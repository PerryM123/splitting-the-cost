// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['@/assets/styles/normalize.css'],
  // TODO: これ必要？？
  components: [
    {
      path: '~/components/',
      pathPrefix: false
    }
  ],
  imports: {
    autoImport: false,
    dirs: []
  }
})
