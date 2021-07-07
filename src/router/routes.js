
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: "timing",
        redirect: "/"
      },
      {
        path: "today",
        component: () => import('pages/Today.vue')
      },
      {
        path: "detail",
        component: () => import('pages/Detail.vue')
      },
      {
        path: "music",
        component: () => import('pages/Music.vue')
      },
      {
        path: "settime",
        component: () => import('pages/SetTime.vue')
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
