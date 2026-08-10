import { Navigate, createBrowserRouter, Outlet } from 'react-router-dom';
import {
  CourseDetail,
  Home,
  Simulation,
  SimulationDetail,
  Article,
  ArticleDetails,
  AccountLayout,
  ProfileSection,
  ChangePassword
} from './pages';
import { routes } from './constants';

const { frontendRoutes } = routes;

const appRoutes = [
  {
    path: frontendRoutes.home,
    element: <Home />
  },
  {
    path: frontendRoutes.simulation,
    element: <Simulation />
  },
  {
    path: `${frontendRoutes.simulation}/:simulationUrl`,
    element: <SimulationDetail />
  },
  {
    path: `${frontendRoutes.simulation}/:courseId/:subCourseId`,
    element: <CourseDetail />
  },
  {
    path: frontendRoutes.article,
    element: <Article />
  },
  {
    path: `${frontendRoutes.article}/:articleId`,
    element: <ArticleDetails />
  },
  {
    path: frontendRoutes.profile,
    element: (
      <AccountLayout>
        <Outlet />
      </AccountLayout>
    ),
    children: [
      {
        index: true,
        element: <ProfileSection />
      },
      {
        path: 'profile',
        element: <ProfileSection />
      },
      {
        path: 'change-password',
        element: <ChangePassword />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
];

const router = createBrowserRouter(appRoutes);

export default router;
