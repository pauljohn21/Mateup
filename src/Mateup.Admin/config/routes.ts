export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/authentication',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/authentication/login',
            component: './Authentication/Login',
          },
          {
            name: 'login-callback',
            path: '/authentication/login-callback',
            component: './Authentication/LoginCallback',
          },
          {
            name: 'login-failed',
            path: '/authentication/login-failed',
            component: './Authentication/LoginFailed',
          },
          {
            name: 'profile',
            path: '/authentication/profile',
            component: './Authentication/Profile',
          },
          {
            name: 'register',
            path: '/authentication/profile',
            component: './Authentication/Profile',
          },
          {
            name: 'logout',
            path: '/authentication/logout',
            component: './Authentication/Logout',
          },
          {
            name: 'logout-callback',
            path: '/authentication/logout-callback',
            component: './Authentication/LogoutCallback',
          },
          {
            name: 'logout-failed',
            path: '/authentication/logout-failed',
            component: './Authentication/LogoutFailed',
          },
          {
            name: 'demo-ui',
            path: '/authentication/demoui',
            component: './Authentication/demo-ui',
          },
        ],
      },

      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/welcome',
              },
              {
                path: '/configuration',
                name: 'configuration',
                icon: 'setting',
                routes: [
                  {
                    path: '/configuration/api-resources',
                    name: 'api-resources',
                    icon: 'smile',
                    component: './Oidc/ApiResources',
                  },
                  {
                    path: '/configuration/api-resources/:apiResourceId',
                    name: 'api-resources-detail',
                    hideInMenu: true,
                    icon: 'crown',
                    component: './Oidc/ApiResources/Detail',
                  },
                  {
                    path: '/configuration/api-resources/:apiResourceId/scopes',
                    name: 'api-resources-scopes',
                    hideInMenu: true,
                    icon: 'crown',
                    component: './Oidc/ApiResources/Scopes',
                  },
                  {
                    path: '/configuration/api-resources/:apiResourceId/secrets',
                    name: 'api-resources-secrets',
                    hideInMenu: true,
                    icon: 'crown',
                    component: './Oidc/ApiResources/Secrets',
                  },
                  {
                    path: '/configuration/api-resources/:apiResourceId/properties',
                    name: 'api-resources-properties',
                    hideInMenu: true,
                    icon: 'crown',
                    component: './Oidc/ApiResources/Properties',
                  },

                ]
              },
              {
                path: '/welcome',
                name: 'welcome',
                icon: 'smile',
                component: './Welcome',
              },
              {
                path: '/admin',
                name: 'admin',
                icon: 'crown',
                component: './Admin',
                authority: ['admin'],
                routes: [
                  {
                    path: '/admin/sub-page',
                    name: 'sub-page',
                    icon: 'smile',
                    component: './Welcome',
                    authority: ['admin'],
                  },
                ],
              },
              {
                name: 'list.table-list',
                icon: 'table',
                path: '/list',
                component: './TableList',
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
    ],
  },
  {
    component: './404',
  },
];
