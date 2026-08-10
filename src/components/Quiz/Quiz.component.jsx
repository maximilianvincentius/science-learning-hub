import { useState, useEffect } from 'react';
import { Typography, Space } from 'antd';

const { Title } = Typography;

import Button from '../Button/Button.component';

const handleSelectAnswer = (answerIndex, onSelect, currentQuestion) => () => {
  const { setAnswers, setSelectedIdxAnswer } = onSelect;
  setAnswers((prev) => ({
    ...prev,
    [currentQuestion.idx]: answerIndex
  }));
  setSelectedIdxAnswer(answerIndex);
};

const _renderAnswers = (currentQuestion, selectedIndex, onSelectAnswer) => {
  const options = currentQuestion.current.options;

  return options.map((answer, index) => (
    <button
      key={index}
      onClick={handleSelectAnswer(index, onSelectAnswer, currentQuestion)}
      className={`w-full text-left px-4 py-3 rounded-lg border transition flex justify-between ${
        selectedIndex === index ? 'bg-blue-500/15 border-blue-500 ring-1 ring-blue-300' : 'bg-gray-100 border-gray-200'
      }`}
    >
      <span>{answer}</span>
    </button>
  ));
};

const _renderQuizQuestion = (props) => {
  const { currentQuestion, selectedIdxAnswer, onSelectAnswer } = props;

  return (
    <div className="flex-1 flex ">
      <div className="bg-white px-4 py-6 rounded-md border p-4 w-full">
        <Title level={4}>{currentQuestion.current.question}</Title>
        <div className="gap-y-4 flex flex-col">
          {_renderAnswers(currentQuestion, selectedIdxAnswer, onSelectAnswer)}
        </div>
      </div>
    </div>
  );
};

const goNext = (props) => () => {
  const {
    currentQuestion: { idx },
    listOfQuestions,
    setCurrentQuestion
  } = props;

  if (idx < listOfQuestions.length - 1) {
    setCurrentQuestion({ idx: idx + 1, current: listOfQuestions[idx + 1] });
  }
};

const goPrev = (props) => () => {
  const {
    currentQuestion: { idx },
    listOfQuestions,
    setCurrentQuestion
  } = props;

  setCurrentQuestion({ idx: idx - 1, current: listOfQuestions[idx - 1] });
};

const _renderNavigationBtn = (props) => {
  const {
    currentQuestion: { idx },
    answers,
    onSubmit,
    listOfQuestions
  } = props;

  const isLastQuestion = idx === listOfQuestions.length - 1;

  const buttonPrev = <Button handleOnClick={goPrev(props)} disabled={idx === 0} text="Previous" variant="secondary" />;

  const buttonNext = (
    <Button
      handleOnClick={isLastQuestion ? _handleOnFinish(answers, onSubmit) : goNext(props)}
      disabled={answers[idx] === null}
      text={isLastQuestion ? 'Finish' : 'Next'}
    />
  );

  if (idx === 0) {
    return buttonNext;
  }

  return (
    <>
      {buttonPrev}
      {buttonNext}
    </>
  );
};

const _formatTime = (sec) => {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const _renderQuizNavigation = (props) => {
  return <Space style={{ marginTop: 25, width: '100%' }}>{_renderNavigationBtn(props)}</Space>;
};

const _renderQuizHeader = (props) => {
  const { currentQuestion, listOfQuestions, timeLeft } = props;

  return (
    <div className="flex justify-between">
      <div className="text-base font-medium">
        {currentQuestion.idx + 1} / {listOfQuestions.length}
      </div>
      <div className="text-base font-semibold">⏱️ {_formatTime(timeLeft)}</div>
    </div>
  );
};

const _renderQuizSection = (props) => (
  <section className="px-6 container mx-auto py-8 space-y-5">
    {_renderQuizHeader(props)}
    {_renderQuizQuestion(props)}
    {_renderQuizNavigation(props)}
  </section>
);

const _handleOnFinish = (answers, onSubmit) => () => {
  onSubmit(answers);
};

const _useSelectAnswer = (currentQuestion, answers, setSelectedIdxAnswer) => {
  useEffect(() => {
    if (answers[currentQuestion.idx] !== undefined) {
      setSelectedIdxAnswer(answers[currentQuestion.idx]);
    } else {
      setSelectedIdxAnswer(null);
    }
  }, [currentQuestion.idx]);
};

const _useGlobalTimer = (setTimeLeft, answers) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          _handleOnFinish(answers)();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
};

const _mapProps = (props) => {
  const { questions: listOfQuestions, onBackPress } = props;
  const [selectedIdxAnswer, setSelectedIdxAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState({ idx: 0, current: listOfQuestions[0] });
  const [timeLeft, setTimeLeft] = useState(900);

  const mapProps = {
    listOfQuestions,
    currentQuestion,
    setCurrentQuestion,
    selectedIdxAnswer,
    answers,
    onSelectAnswer: {
      setAnswers,
      setSelectedIdxAnswer
    },
    onBackPress,
    timeLeft,
    onSubmit: props.onSubmit,
    setTimeLeft,
    setSelectedIdxAnswer
  };

  return mapProps;
};

const Quiz = (props) => {
  const mapProps = _mapProps(props);
  const { currentQuestion, answers, setTimeLeft, setSelectedIdxAnswer } = mapProps;

  _useGlobalTimer(setTimeLeft);
  _useSelectAnswer(currentQuestion, answers, setSelectedIdxAnswer);

  return _renderQuizSection(mapProps);
};

export default Quiz;
