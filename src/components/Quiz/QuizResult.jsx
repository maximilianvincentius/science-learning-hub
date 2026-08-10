import { Progress } from 'antd';
import { useEffect, useState } from 'react';

import Button from '../Button/Button.component';
import { CheckCircleOutlined, CloseOutlined, MinusCircleOutlined } from '@ant-design/icons';

import './QuizResult.css';

import { courses } from '../../constants';

const { QUIZ_STATUS } = courses;

const _renderHeader = (status) => (
  <div className="text-center font-semibold text-xl py-2 border-b-gray-100 border-b-2">
    Your score status:
    <span className={`${status === QUIZ_STATUS.PASSED ? 'text-green-600' : 'text-red-600'}`}>{status}</span>
  </div>
);

const _renderScoreDetails = (correct, incorrect, unanswered) => {
  const config = [
    {
      color: 'text-green-600',
      type: 'Correct',
      component: <CheckCircleOutlined className="icon-font-large" />,
      value: correct
    },
    {
      color: 'text-red-600',
      type: 'Incorrect',
      component: <CloseOutlined className="icon-font-large" />,
      value: incorrect
    },
    {
      color: 'text-black',
      type: 'Unanswered',
      component: <MinusCircleOutlined className="icon-font-large" />,
      value: unanswered
    }
  ];

  const row = config.map((element, index) => (
    <tr key={index} className={`${element.color} ${index !== 0 ? 'border-t-2 border-gray-100' : 'border-t-0'}`}>
      <td className="px-4 py-2 text-lg items-center flex gap-2">
        {element.component} {element.type}
      </td>
      <td className="px-4 py-2 text-lg">Score: {element.value}</td>
    </tr>
  ));

  return (
    <table className="w-full sm:w-1/2 mx-auto border-transparent">
      <tbody>{row}</tbody>
    </table>
  );
};

const _renderPercentage = (percentage, totalQuestions) => (
  <div className="text-center">
    <div className="text-lg font-semibold my-5 text-center">
      You have completed the quiz with a satisfactory score. Your score (%):
    </div>
    <Progress type="circle" size={150} format={(percent) => percent + '%'} strokeWidth={10} percent={percentage} />
    <div className="text-lg font-semibold my-5">Total questions: {totalQuestions}</div>
  </div>
);

const _renderRetakeQuiz = (backToRetakeQuiz, status) => {
  if (status === QUIZ_STATUS.PASSED) {
    return null;
  }

  return (
    <div className="text-center my-10 flex flex-col items-center gap-y-5 pb-10">
      <Button text="Retake Quiz" variant="primary" size="medium" handleOnClick={backToRetakeQuiz} />
    </div>
  );
};

const _mapProps = (props) => {
  const { result: quizResult, backToRetakeQuiz } = props;

  const result = quizResult.current;

  return {
    correct: result.correct || 0,
    correctPercentage: result.correctPercentage || 0,
    incorrect: result.incorrect || 0,
    unanswered: result.unanswered || 0,
    status: result.status || '',
    totalQuestions: result.totalQuestions || 0,
    backToRetakeQuiz
  };
};

const QuizResult = (props) => {
  const mappedProps = _mapProps(props);
  const { correct, correctPercentage, incorrect, unanswered, status, totalQuestions, backToRetakeQuiz } = mappedProps;
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setPercentage(correctPercentage);
    }, 250);
  }, []);
  return (
    <div className="bg-white min-w-40 container mx-auto p-5 shadow-sm rounded-lg my-5">
      {_renderHeader(status)}
      {_renderPercentage(percentage, totalQuestions)}
      {_renderScoreDetails(correct, incorrect, unanswered)}
      {_renderRetakeQuiz(backToRetakeQuiz, status)}
    </div>
  );
};

export default QuizResult;
