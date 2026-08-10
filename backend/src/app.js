const express = require('express');
const { S3Client } = require('@aws-sdk/client-s3');

const {
  UserService,
  SimulationService,
  CourseService,
  EnrollmentService,
  ArticleService,
} = require('./services');
const { user, simulation, course, enrollment, article } = require('./models');
const {
  UserController,
  SimulationController,
  CourseController,
  ArticleController,
  SearchController,
} = require('./controllers');
const { AWSConnector } = require('./connector');
const indexRoutes = require('./routes');
const { default: config } = require('./config/index');

const s3 = new S3Client({
  region: config.awsRegion,
  credentials: { accessKeyId: config.awsAccessKey, secretAccessKey: config.awsSecretKey },
});

const app = express();
app.use(express.json());

const registerConnector = () => ({
  awsConnector: new AWSConnector(s3),
});

const registerService = () => ({
  userService: new UserService(user),
  simulationService: new SimulationService(simulation),
  courseService: new CourseService(course),
  enrollmentService: new EnrollmentService(enrollment),
  articleService: new ArticleService(article),
});

const registerController = () => {
  const { userService, simulationService, courseService, enrollmentService, articleService } =
    registerService();
  const { awsConnector } = registerConnector();
  return {
    userController: new UserController(userService, config),
    simulationController: new SimulationController(
      simulationService,
      courseService,
      enrollmentService,
      userService,
      config,
    ),
    courseController: new CourseController(courseService, enrollmentService, awsConnector),
    articleController: new ArticleController(articleService),
    searchController: new SearchController({ articleService, simulationService }),
  };
};
app.locals.controller = registerController();

indexRoutes(app);

export default app;
