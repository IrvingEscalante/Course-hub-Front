export const API_ROUTES = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    verify_email:'/auth/verify-email',
    resend_code: '/auth/resend-code'
  },
  users: {
    my_data: '/users/profile',
    profile: '/users/user/'
  },
  courses: {
    create: '/course/create',
    courses_dashboard: '/course/courses',
    course_detail:'/detail_course/detail/'
  },
  detail_course:{
    get_modules: '/detail_course/modules/'
  },
  favorites:{
    add_delete_favorites: '/users/user/favorite',
    get_favorites: '/users/user/favorites/'
  },
  follow:{
    follow_unfollow: '/users/user/follow_unfollow/'
  }
}