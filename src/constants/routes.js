const frontendRoutes = {
  home: '/',
  register: '/register',
  login: '/login',
  simulation: '/simulation',
  simulationDetail: '/simulation/:id',
  article: '/article',
  articleDetail: '/article/:id',
  profile: '/profile',
  changePassword: '/profile/change-password'
};

const backendRoutes = {
  register: '/users/register',
  login: '/users/login'
};

export default { frontendRoutes, backendRoutes };
