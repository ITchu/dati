import Vue from 'vue'
import Router from 'vue-router'

import index from '@/components/index'
const start=()=>import( '@/components/start')
const rules=()=>import( '@/components/rules')
const rankingList=()=>import( '@/components/rankingList')
const card=()=>import( '@/components/card')
const reward=()=>import( '@/components/reward')

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component:index,
    },
    {
      path:'/start/:revive_num',
      name:'start',
      component:start
    },
    {
      path:'/rules',
      name:'rules',
      component:rules
    },
    {
      path:'/rankingList',
      name:'rankingList',
      component:rankingList
    },
    {
      path:'/card',
      name:'card',
      component:card
    },
    {
      path:'/reward',
      name:'reward',
      component:reward
    }
  ]
})
