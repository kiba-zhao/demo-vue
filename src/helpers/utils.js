export function installPlugin(ctx, vue, options) {
  const { modules, locales, components } = ctx;
  const { i18n, store } = options;

  if (modules && store)
    for (let name in modules)
      store.registerModule(name, modules);

  if (locales)
    for (let locale in locales)
      i18n.mergeLocaleMessage(locale, locales[locale]);

  if (components)
    for (let key in components) {
      let component = components[key];
      let { name } = component;

      vue.component(name, component);
    }

}
