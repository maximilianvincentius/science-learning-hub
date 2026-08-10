import { Tabs as AntTabs } from 'antd';

import { TabsPropTypes, TabsDefaultProps } from './Tabs.types';

import './Tabs.css';

const _getCourseTab = (course) => ({
  key: '2',
  label: 'Course',
  children: course
});

const Tabs = ({ about, course, isUnEnrolledCourse }) => {
  const items = [
    {
      key: '1',
      label: 'About',
      children: about
    },
    ...(!isUnEnrolledCourse ? [_getCourseTab(course)] : [])
  ];

  return <AntTabs defaultActiveKey="1" items={items} className="custom-tab h-full" />;
};

Tabs.propTypes = TabsPropTypes;
Tabs.defaultProps = TabsDefaultProps;

export default Tabs;
