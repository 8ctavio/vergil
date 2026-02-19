import './styles/playground.css'

import { createApp } from 'vue'
import { vergil } from 'vergil/plugins'
import App from './App.vue'

createApp(App)
	.use(vergil)
	.mount('#app')