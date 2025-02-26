import { createApp } from 'vue';
import monitor from '../../../src/webEyeSDK';
import './style.css';
import App from './App.vue';

const app = createApp(App);
app.use(monitor, {
    url: 'http://localhost:9800/reportData',
});
app.mount('#app');
