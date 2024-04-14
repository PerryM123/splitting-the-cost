// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['@/assets/styles/normalize.css'],
  components: [
    {
      path: '~/components/',
      pathPrefix: false
    }
  ],
  imports: {
    autoImport: false,
    dirs: []
  },
  app: {
    baseURL: '/splitting-the-cost/',
    cdnURL: '/splitting-the-cost/'
  }
})
