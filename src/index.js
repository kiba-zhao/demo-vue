import * as components from './components';
import * as modules from './stores';
import * as locales from './locales';
import {installPlugin} from './helpers';
import {paths} from './config';
export * from './helpers';

export const install = installPlugin.bind(this,{paths,modules,locales,components});
