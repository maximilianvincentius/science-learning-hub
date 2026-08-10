import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Tag } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

import Button from '../../../../components/Button/Button.component';
import { routes, courses } from '../../../../constants';

const { frontendRoutes } = routes;
const { STATUS: COURSE_STATUS, STATUS_TEXT: COURSE_STATUS_TEXT } = courses;

const _renderTagStatus = (status) => {
  if (status === COURSE_STATUS.COMPLETED) {
    return (
      <div className="sm:self-baseline self-center">
        <Tag icon={<CheckCircleOutlined />} color="success">
          {COURSE_STATUS_TEXT.COMPLETED}
        </Tag>
      </div>
    );
  }
};

const _handleOnClickCourse = (navigate, courseId, subCourseId) => () => {
  navigate(`${frontendRoutes.simulation}/${courseId}/${subCourseId}`);
};

const _renderAvailableList = (item, navigate, simulationId) => {
  const { status, subCourseId } = item;
  if (status !== COURSE_STATUS.LOCKED) {
    return (
      <Button text="View" variant="primary" handleOnClick={_handleOnClickCourse(navigate, simulationId, subCourseId)} />
    );
  }
};

const _renderItems = (items, isAuthenticated, navigate, simulationId) => {
  const { subCourses } = items;
  const disabledStyle = 'opacity-50 cursor-not-allowed';
  const lockedStyle = 'bg-gray-100 text-gray-400 cursor-not-allowed';

  return subCourses.map((item, index) => {
    const isLocked = item.status === COURSE_STATUS.LOCKED;
    return (
      <li
        className={`${isAuthenticated ? '' : 'blur cursor-not-allowed'} py-3 px-3 rounded-md my-5 border border-solid list-none drop-shadow-sm ${isLocked ? lockedStyle : 'bg-white'} ${item.disabled ? disabledStyle : ''}`}
        key={index}
      >
        <div className="sm:flex justify-between">
          <div className="flex sm:flex-col justify-between mb-2 gap-2">
            <h4 className="text-base lg:text-lg font-semibold mb-2 self-center sm:self-start">{item.title}</h4>
            {_renderTagStatus(item.status)}
          </div>
          <div className="gap-3 flex self-center">{_renderAvailableList(item, navigate, simulationId)}</div>
        </div>
      </li>
    );
  });
};

const _renderSection = (items, isAuthenticated, navigate) => {
  return items.courseData.map((item, index) => {
    return (
      <div key={index} className="mb-10">
        <h3 className="text-xl font-semibold">{item.topic}</h3>
        <ul className="list-none p-0 !m-0">{_renderItems(item, isAuthenticated, navigate, items.simulationId)}</ul>
      </div>
    );
  });
};

const _renderItemsLayout = (items, isAuthenticated, navigate) => (
  <ul>{_renderSection(items, isAuthenticated, navigate)}</ul>
);

const Course = ({ data }) => {
  const { courseContent, isAuthenticated } = data;
  const navigate = useNavigate();

  return <div>{_renderItemsLayout(courseContent, isAuthenticated, navigate)}</div>;
};

export default Course;
