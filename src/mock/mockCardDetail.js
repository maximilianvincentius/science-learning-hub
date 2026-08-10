const mockCardDetail = {
  simulationHtmlUrl: '/sims/html/buoyancy-basics/latest/buoyancy-basics_all.html',
  title: 'Buoyancy Basics',
  about:
    "Explore the principles of buoyancy with this interactive simulation. Adjust parameters such as fluid density, object density, and volume to see how they affect buoyant force and stability. Perfect for students and educators looking to understand Archimedes' principle in a hands-on way.",
  quizContent: [
    {
      question: 'What happens to the buoyant force when the fluid density increases?',
      options: ['It decreases', 'It increases', 'It remains the same', 'It becomes zero'],
      answer: 'It increases'
    },
    {
      question: 'Which principle explains why objects float or sink in a fluid?',
      options: ["Newton's First Law", "Archimedes' Principle", "Bernoulli's Principle", "Pascal's Law"],
      answer: "Archimedes' Principle"
    },
    {
      question: 'If an object is less dense than the fluid it is placed in, what will happen?',
      options: ['It will sink', 'It will float', 'It will dissolve', 'It will remain suspended'],
      answer: 'It will float'
    },
    {
      question: 'How does increasing the volume of an object affect its buoyancy?',
      options: [
        'Increases buoyant force',
        'Decreases buoyant force',
        'No effect on buoyant force',
        'Causes the object to sink'
      ],
      answer: 'Increases buoyant force'
    }
  ]
};

export default mockCardDetail;
