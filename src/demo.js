import { vuex } from './index';
import View from './demo.vue';
import * as views from './views';


import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

Vue.use(Vuex);
Vue.use(VueRouter);
const store = new Vuex.Store(vuex);

const keys = Object.keys(views);
const routes = [];
const links = [];
for (let key of keys) {
  let name = views[key].name;
  let path = `/${key}`;
  routes.push({ path, component: views[key] });
  links.push({ path, name: name, key });
}
const router = new VueRouter({
  routes: [
    ...routes,
    { path: '/', component: View, props: { links } }
  ]
});

const root = document.createElement('div');
document.body.appendChild(root);

let vm = new Vue({
  el: root,
  store,
  router,
  render: _ => _('router-view')
});
