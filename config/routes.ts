export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   component: './Admin',
  //   routes: [
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //     {
  //       component: './404',
  //     },
  //   ],
  // },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  {
    name: 'onetable',
    icon: 'table',
    path: '/onetable',
    component: './test/onetable',
  },
  {
    name: 'childtable',
    icon: 'table',
    path: '/childtable',
    component: './test/childtable',
  },
  // {
  //   name: 'textbox',
  //   icon: 'table',
  //   path: '/textbox',
  //   component: './test/textbox',
  // },
  {
    name: 'main',
    icon: 'table',
    path: '/main/:s/:c',
    component: './views/main',
  },
  {
    name: 'form',
    icon: 'table',
    path: '/form/:s/:c',
    component: './views/form',
  },
  {
    name: 'demo',
    icon: 'table',
    path: '/websocketdemo',
    component: './views/websocketdemo',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
