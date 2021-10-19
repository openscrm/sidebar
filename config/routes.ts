export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      // 公开路由
      {
        name: '员工登录',
        path: '/staff-frontend/login',
        component: './StaffFrontend/Login/index',
      },
      {
        path: '/staff-frontend/login-callback',
        routes: [
          {
            name: '员工登录回调',
            path: '/staff-frontend/login-callback',
            component: './StaffFrontend/Login/callback',
          },
        ],
      },
      {
        path: '/',
        exact: true,
        redirect: '/staff-frontend/login',
      },

      // 侧边栏员工登录后授权路由
      {
        name:'侧边栏员工登录后授权路由',
        path: '/staff-frontend/',
        component: '../layouts/StaffFrontendSecurityLayout',
        routes: [
          {
            path: '/staff-frontend/',
            component: '../layouts/BasicLayout',
            routes: [
              {
                path: '/staff-frontend/',
                exact: true,
                redirect: '/staff-frontend/welcome',
              },
              {
                path: '/staff-frontend/welcome',
                name: '首页',
                component: './Welcome',
              },
              {
                name: '话术库',
                path: '/staff-frontend/script-library',
                component: './StaffFrontend/ScriptLibrary/index',
              },
              {
                name: '素材库',
                path: '/staff-frontend/material-library',
                component: './StaffFrontend/MaterialLibrary/index',
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },

      //缺省路由
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
