// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['@/assets/styles/normalize.css'],
  imports: {
    autoImport: false,
    dirs: []
  }
})
