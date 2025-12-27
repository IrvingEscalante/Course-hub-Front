import { create } from "domain";

export const API_ROUTES = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    verify_email:'/auth/verify-email',
    resend_code: '/auth/resend-code',
    recover_password:'/users/recover-password'
  },
  users: {
    my_data: '/users/profile',
    profile: '/users/user/',
    edit_profile: '/users/edit-profile'
  },
  courses: {
    create: '/course/create',
    courses_dashboard: '/course/courses',
    course_detail:'/detail_course/detail/',
    copy_course: '/course/copy/',
    edit_course: '/course/edit/',
    edit_basics: '/course/update-basics/'
  },
  detail_course:{
    get_full_data_course: '/detail_course/course/raw/',
    get_publications:'/detail_course/publications/'
  },
  module_course:{
    get_modules:'/modules/getAll/',
    get_module:'/modules/getById/',
    create_module:'/modules/create/',
    edit_module:'/modules/edit/',
    delete_module: '/modules/delete/'
  },
  favorites:{
    add_delete_favorites: '/favorites/add_delete/',
    get_favorites: '/favorites/'
  },
  follow:{
    follow_unfollow: '/users/user/follow_unfollow/',
    get_followers: '/follow/followers/',
    get_following: '/follow/following/'
  },
  themes:{
    theme:'/theme/'
  },
  rating_comments:{
    create:'/rating_comments/create',
    getAllComments:'/rating_comments/course/'
  },
  pull_request:{
    get_pulls:'/pull-request/get_pull_request/'
  }
}