import { vuex, i18n as messages, components } from './index';
import View from './demo.vue';
import * as views from './views';

import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: (navigator.language || navigator.userLanguage).substr(0, 2),
  fallbackLocale: 'en',
  messages
});

const store = new Vuex.Store(vuex);

for (let componentKey in components) {
  let component = components[componentKey];
  Vue.component(component.name || componentKey, component);
}

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

new Vue({
  el: root,
  i18n,
  store,
  router,
  render: _ => _('router-view')
});
