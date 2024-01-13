import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import './assets/main.css'
// import * as Vue from 'vue' // in Vue 3

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.use(VueAxios, axios)

app.mount('#app')
