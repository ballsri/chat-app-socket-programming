// https://nuxt.com/docs/api/configuration/nuxt-config
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

export default defineNuxtConfig({
    // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  app:{
    head: {
        title: 'Chat app',
        htmlAttrs: {
           lang: 'en'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/icon.ico' }
        ]
        }
    },
    css: [
        'ant-design-vue/dist/antd.css'
      ],

      vite: {
        plugins: [
          Components({
            resolvers: [AntDesignVueResolver({resolveIcons: true})],
          }),
        ],
 
        ssr: {
          noExternal: ['moment', 'compute-scroll-into-view', 'ant-design-vue','@ant-design/icons-vue'],
        },
      },

})
