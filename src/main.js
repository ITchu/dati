// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import rem from '@/assets/rem.js'
import ws from '@/assets/ws.js'

Vue.prototype.ws=ws;
Vue.config.productionTip = false
/*var message=JSON.parse(window.localStorage.jituStore);
Vue.prototype.userMessage={
  userid:message.uid,
  token:message.token,
}*/
Vue.prototype.userMessage={
  userid: "2593",
  token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9zdHVkeS5iaWhhb2h1by5jbiIsImF1ZCI6ImFwcDpcL1wvc3R1ZHkuYmloYW9odW8uY24iLCJpYXQiOjE1Mjc2NDM0NzYsIm5iZiI6MTUyNzY0MzQ3NiwidWlkIjoyNTkzfQ.-Dn2OUenPreehd-M01gSC42CWRUWC7AV94c1mYjfs3A",
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
