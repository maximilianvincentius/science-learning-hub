import { Link, useParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { notification } from 'antd';
import { playSimBtn } from '../../assets/img';
import MainLayout from '../../components/Layout';
import Tabs from '../../components/Tabs/Tabs';
import { authApi, publicApi } from '../../api';
import { AuthContext } from '../../context/AuthContext';
import About from './Tabs/About/About.component';
import Course from './Tabs/Course/Course.component';
import Button from '../../components/Button/Button.component';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import { ArrowLeftOutlined } from '@ant-design/icons';

const _useAnimatedProgress = (progress) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (typeof progress === 'number') {
      setAnimatedProgress(progress);
    }
  }, [progress]);

  return animatedProgress;
};

const _renderSimulationBanner = (imageUrl, simulationUrl) => (
  <div className="mb-4 relative block">
    <img src={imageUrl} alt="buoyancy-background-blur" className="w-full h-80 object-cover blur-sm opacity-70" />
    <img
      src={imageUrl}
      alt="buoyancy-background"
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-52 sm:w-96 sm:h-64 lg:w-[32rem] lg:h-80 rounded-lg shadow-lg border-2 border-white object-cover"
    />
    <Link to={simulationUrl} target="_blank">
      <img
        src={playSimBtn}
        alt="play-simulation"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 z-10 hover:scale-110 transition-transform cursor-pointer"
      />
    </Link>
  </div>
);

const _getUnEnrolledCourseData = (data, isAuthenticated) => ({
  courseContent: {
    courseData: data.courses,
    simulationId: data.simulationId
  },
  isAuthenticated
});

const RELATED_ARTICLES_LIMIT = 8;

const _filterRelatedArticles = (articles, simulationCategory) => {
  const category = simulationCategory?.toLowerCase();
  const matched = articles.filter((article) => article.topic && article.topic.toLowerCase() === category);

  return matched.length > 0 ? matched.slice(0, RELATED_ARTICLES_LIMIT) : [];
};

const _useFetchRelatedArticles = (simulationData, setRelatedArticles) => {
  useEffect(() => {
    if (!simulationData?.category) {
      return undefined;
    }
    let cancelled = false;

    const fetchRelatedArticles = async () => {
      try {
        const response = await publicApi.get('/articles');
        const { data: articles } = response.data;
        if (!cancelled && articles) {
          setRelatedArticles(_filterRelatedArticles(articles, simulationData.category));
        }
      } catch {
        // Related articles are non-critical; silently ignore fetch errors
      }
    };

    fetchRelatedArticles();
    return () => {
      cancelled = true;
    };
  }, [simulationData, setRelatedArticles]);
};

const _renderRelatedArticleCard = (article) => (
  <div className="flex flex-col overflow-hidden rounded-md border border-slate-100 bg-surface shadow-card transition-all duration-slow ease-smooth hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-elevated h-full min-h-[260px]">
    {article.image && (
      <div className="relative overflow-hidden rounded-md aspect-video">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-slower ease-smooth"
        />
      </div>
    )}
    <div className="px-4 pt-4 pb-3">
      <h3 className="font-heading text-base font-semibold text-ink-primary line-clamp">{article.title}</h3>
      {article.author && <p className="mt-1 font-body text-xs font-medium text-ink-secondary">{article.author}</p>}
    </div>
    {article.content && (
      <div className="flex-1 px-4">
        <p className="font-body text-sm leading-relaxed text-ink-secondary line-clamp-3">{article.content}</p>
      </div>
    )}
    {article.topic && (
      <div className="mt-auto px-4 pt-4 pb-4">
        <span className="inline-block rounded-full bg-brand-primary/10 px-2.5 py-1 font-body text-2xs font-bold uppercase tracking-wider text-brand-primary">
          {article.topic}
        </span>
      </div>
    )}
  </div>
);

const _renderRelatedArticles = (articles) => {
  if (!articles?.length) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Related Articles</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {articles.map((article) => (
          <Link
            key={article._id}
            to={`/article/${article._id}`}
            className="shrink-0 w-[calc(50%-0.5rem)] md:w-[calc(25%-0.75rem)] block"
          >
            {_renderRelatedArticleCard(article)}
          </Link>
        ))}
      </div>
    </section>
  );
};

const _enrollCourse = (simulationId, props) => async () => {
  try {
    const { isAuthenticated, setOpenAuthForm } = props;
    if (!isAuthenticated) {
      setOpenAuthForm(true);
      return;
    }

    await authApi.post(`/simulations/${simulationId}/enroll`);
    props.setIsUnEnrolledCourse(false);
  } catch (error) {
    props.setError(error.response.data.message);
  }
};

const _renderSection = (props) => {
  const { data } = props;

  const dataAbout = {
    overview: data.overview,
    topics: data.topics,
    learningGoals: data.learningGoals
  };

  const dataCourse = !data.isUnEnrolledCourse
    ? _getUnEnrolledCourseData(data, props.isAuthenticated, props.setOpenAuthForm)
    : null;

  return (
    <section className="mt-6 px-6 mx-auto pb-24">
      <div className="sm:flex sm:justify-between">
        <h1 className="text-4xl font-semibold flex items-center gap-4">{data.title}</h1>
        <div className="w-full sm:max-w-[300px]">
          {!data.isUnEnrolledCourse && typeof props.data.progress === 'number' && (
            <ProgressBar progress={props.data.progress} title={data.title} animatedProgress={props.animatedProgress} />
          )}
          {data.isUnEnrolledCourse && (
            <div className="my-3">
              <Button
                text="Enroll Now"
                variant="primary"
                size="medium"
                handleOnClick={_enrollCourse(data.simulationId, props)}
              />
            </div>
          )}
        </div>
      </div>
      {/* <div className="md:max-w-[220px] w-full flex">
      </div> */}
      <Tabs
        about={<About data={dataAbout} />}
        course={<Course data={dataCourse} />}
        isUnEnrolledCourse={data.isUnEnrolledCourse}
      />
    </section>
  );
};

const _renderContent = (props) => (
  <div className="mt-6">
    <button
      type="button"
      onClick={() => {
        props.navigate(-1);
      }}
      className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
    >
      <ArrowLeftOutlined />
      Back
    </button>
    <div className="!bg-white rounded-lg">
      {_renderSimulationBanner(props.data.image, props.data.simulationUrl)}
      {_renderSection(props)}
    </div>
  </div>
);

const _renderSimulationContent = (props) => !props.loading && _renderContent(props);

const _mapStateToProps = () => {
  const { simulationUrl } = useParams();
  const [data, setData] = useState(null);
  const [isSimulationOpen, setIsSimulationOpen] = useState(true);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isQuizTaken, setIsQuizTaken] = useState(false);
  const [isUnEnrolledCourse, setIsUnEnrolledCourse] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const quizResult = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, setOpenAuthForm } = useContext(AuthContext);
  const animatedProgress = _useAnimatedProgress(data?.progress || 0);

  return {
    simulationUrl,
    isQuizOpen,
    setIsQuizOpen,
    data,
    setData,
    loading,
    setLoading,
    navigate,
    isAuthenticated,
    setOpenAuthForm,
    setIsQuizTaken,
    setIsSimulationOpen,
    quizResult,
    isQuizTaken,
    isSimulationOpen,
    isUnEnrolledCourse,
    setIsUnEnrolledCourse,
    error,
    setError,
    animatedProgress,
    relatedArticles,
    setRelatedArticles
  };
};

const _useFetchData = async (mappedProps) => {
  const { simulationUrl, setData, setLoading, isUnEnrolledCourse, isAuthenticated } = mappedProps;
  useEffect(() => {
    const fetchData = async () => {
      let response;
      if (!isAuthenticated) {
        response = await publicApi.get(`/simulations/${simulationUrl}/public`);
      } else {
        response = await authApi.get(`/simulations/${simulationUrl}`);
      }
      const { data } = response;
      if (data) {
        setLoading(false);
        setData(data);
      }
    };
    fetchData();
  }, [simulationUrl, isUnEnrolledCourse, isAuthenticated]);
};

const _useDisplayErrorNotification = (error, api, setError) => {
  useEffect(() => {
    if (error) {
      api['info']({
        message: 'Attention',
        description: error,
        placement: 'top'
      });
      setError(null);
    }
  }, [error]);
};

const SimulationDetail = () => {
  const [api, contextHolder] = notification.useNotification();
  const mappedProps = _mapStateToProps();
  const { error, setError } = mappedProps;

  _useFetchData(mappedProps);
  _useDisplayErrorNotification(error, api, setError);
  _useFetchRelatedArticles(mappedProps.data, mappedProps.setRelatedArticles);

  return (
    <MainLayout>
      {contextHolder}
      {mappedProps.isSimulationOpen && _renderSimulationContent(mappedProps)}
      {_renderRelatedArticles(mappedProps.relatedArticles)}
    </MainLayout>
  );
};

export default SimulationDetail;
