// https://umijs.org/config/
import {defineConfig} from 'umi';
import proxy from './proxy';
import routes from './routes';
import theme from './theme';

const {REACT_APP_ENV} = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'browser',
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // https://umijs.org/zh-CN/config#theme
  theme: theme,
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // 快速刷新功能 https://umijs.org/config#fastrefresh
  fastRefresh: {},
  esbuild: {},
  // webpack5: {},
  request: {
    dataField: 'data',
  },
  devServer: {
    host:'sidebar.dev.openscrm.cn',
    port: 9000,
  }
});
