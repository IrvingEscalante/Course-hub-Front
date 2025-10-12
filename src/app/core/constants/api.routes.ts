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
    courses_dashboard: '/course/courses'
  }
}