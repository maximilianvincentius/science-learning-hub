import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Progress, Modal } from 'antd';
import { ArrowLeftOutlined, ExclamationCircleFilled } from '@ant-design/icons';

import { storageService } from '../../../../../services';
import { courses } from '../../../../../constants';
import MainLayout from '../../../../../components/Layout';
import authApi from '../../../../../api/authApi';
import PdfViewer from '../../../../../components/PdfViewer/PdfViewer.component.jsx';
import Quiz from '../../../../../components/Quiz/Quiz.component.jsx';
import QuizResult from '../../../../../components/Quiz/QuizResult.jsx';

const { COURSE_TYPE, STATUS: COURSE_STATUS } = courses;
const { confirm } = Modal;

const _validateIsQuizTaken = (data, state) => {
  if (data.type === COURSE_TYPE.QUIZ && data.status === COURSE_STATUS.COMPLETED) {
    state.setIsQuizTaken(true);
    state.quizResult.current = data.additionalData;
  }
};

const _useFetchData = (courseId, subCourseId, setData, setLoading, state) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authApi.get(`/courses/${courseId}/${subCourseId}`);
        const { data } = response;

        if (data) {
          setLoading(false);
          setData(data);
          _validateIsQuizTaken(data, state);
        }
      } catch (error) {
        console.error('Error fetching course detail data:', error);
        throw error;
      }
    };

    fetchData();
  }, [courseId, subCourseId]);
};

const _handleOnSubmit = (data, state) => async (quizAnswers) => {
  const { courseId, subCourseId } = data;
  const { quizResult, setIsQuizTaken } = state;
  const requestBody = {
    answers: quizAnswers,
    courseId,
    subCourseId
  };
  confirm({
    title: 'Are you sure you want to submit?',
    icon: <ExclamationCircleFilled />,
    content: 'Submitting your quiz will finalize your answers.',
    okText: 'Submit',
    okType: 'primary',
    width: 800,
    cancelButtonProps: {
      className: 'hover:!border-gray-400 hover:!text-gray-600'
    },
    okButtonProps: {
      className: 'bg-purple-primary hover:!bg-purple-primary-hover'
    },
    cancelText: 'Cancel',
    async onOk() {
      try {
        const response = await authApi.post('/courses/quiz/result', requestBody);
        quizResult.current = response.data;
        setIsQuizTaken(true);
      } catch (error) {
        console.error('Error submitting quiz:', error);
      }
    },
    onCancel() {}
  });
};

const _renderPdf = (data, state) => (
  <div className="py-5">
    <div className="py-3 ">
      <Progress percent={state.progressBar} showInfo={false} />
    </div>
    <PdfViewer
      data={data}
      state={state}
      onProgress={(number) => {
        state.setProgressBar(number);
      }}
    />
  </div>
);

const _handleOnRetakeQuiz = (state) => () => {
  state.setIsQuizTaken(false);
};

const _renderQuiz = (data, state) => <Quiz questions={data.content} onSubmit={_handleOnSubmit(data, state)} />;

const _renderContentType = (data, state) => {
  if (!state.isLoading) {
    if (data.type === COURSE_TYPE.QUIZ) {
      return _renderQuiz(data, state);
    }

    return _renderPdf(data, state);
  }
};

const _renderContent = (navigation, data, state) => (
  <section className="px-6 container mx-auto pt-4 mt-20">
    <button
      type="button"
      onClick={() => {
        navigation(-1);
      }}
      className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
    >
      <ArrowLeftOutlined />
      Back
    </button>
    {!state.isQuizTaken && _renderContentType(data, state)}
    {state.isQuizTaken && <QuizResult result={state.quizResult} backToRetakeQuiz={_handleOnRetakeQuiz(state)} />}
  </section>
);

const CourseDetail = () => {
  const navigation = useNavigate();
  const { courseId, subCourseId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progressBar, setProgressBar] = useState(0);
  const [isQuizTaken, setIsQuizTaken] = useState(false);
  const containerRef = useRef(null);
  const maxValueRef = useRef(0);
  const quizResult = useRef(null);

  const state = {
    isLoading,
    progressBar,
    setProgressBar,
    maxValueRef,
    containerRef,
    isQuizTaken,
    setIsQuizTaken,
    quizResult
  };

  _useFetchData(courseId, subCourseId, setData, setIsLoading, state);

  useEffect(() => {
    const updateProgress = (progress) => {
      authApi.patch(`courses/${courseId}/${subCourseId}`, { progress });
    };

    if (progressBar === 100) {
      updateProgress(100);
    } else if (progressBar !== 0 && progressBar % 20 === 0) {
      storageService.setPdfProgress(progressBar);
    }
  }, [progressBar]);

  return <MainLayout>{_renderContent(navigation, data, state)}</MainLayout>;
};

export default CourseDetail;
