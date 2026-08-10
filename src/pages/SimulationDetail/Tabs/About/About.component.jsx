import './About.css';

const _renderItems = (items) => items.map((item, index) => <li key={index}>{item}</li>);

const About = ({ data }) => {
  const { overview, topics, learningGoals } = data;

  return (
    <>
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-3">Overview</h2>
        <div className="text-base">{overview}</div>
      </div>

      <div className="my-10">
        <h2 className="text-2xl font-bold mb-3">Topics</h2>
        <ul className="text-base">{_renderItems(topics)}</ul>
      </div>

      <div className="my-10">
        <h2 className="text-2xl font-bold mb-3">Learning Goals</h2>
        <ul className="text-base">{_renderItems(learningGoals)}</ul>
      </div>
    </>
  );
};

export default About;
