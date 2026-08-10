const cardData = [
  {
    simulationId: '12345',
    simulationUrl: 'pendulum-motion-simulation',
    title: 'Pendulum Motion Simulation',
    image:
      'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: false
  },
  {
    simulationId: '12342',
    simulationUrl: 'projectile-motion-physics',
    title: 'Projectile Motion Physics',
    image:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: true
  },
  {
    simulationId: '12341',
    simulationUrl: 'wave-interference-patterns',
    title: 'Wave Interference Patterns',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: false
  },
  {
    simulationId: '12346',
    simulationUrl: 'electric-field-visualization',
    title: 'Electric Field Visualization',
    image:
      'https://images.unsplash.com/photo-1530996786026-24ea19470d5d?q=80&w=2013&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: true
  },
  {
    simulationId: '12347',
    simulationUrl: 'magnetic-force-demonstration',
    title: 'Magnetic Force Demonstration',
    image:
      'https://images.unsplash.com/photo-1518496650985-3b8e0a7be04b?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: false
  },
  {
    simulationId: '12348',
    simulationUrl: 'sound-wave-propagation',
    title: 'Sound Wave Propagation',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: true
  },
  {
    simulationId: '12349',
    simulationUrl: 'heat-transfer-simulation',
    title: 'Heat Transfer Simulation',
    image:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: false
  },
  {
    simulationId: '12350',
    simulationUrl: 'optical-refraction-demo',
    title: 'Optical Refraction Demo',
    image:
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: true
  },
  {
    simulationId: '12351',
    simulationUrl: 'gravitational-force-model',
    title: 'Gravitational Force Model',
    image:
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: false
  },
  {
    simulationId: '12352',
    simulationUrl: 'chemical-reaction-kinetics',
    title: 'Chemical Reaction Kinetics',
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: true
  },
  {
    simulationId: '12353',
    simulationUrl: 'circuit-analysis-tool',
    title: 'Circuit Analysis Tool',
    image:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=2125&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: false
  },
  {
    simulationId: '12354',
    simulationUrl: 'fluid-dynamics-visualization',
    title: 'Fluid Dynamics Visualization',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: true
  },
  {
    simulationId: '12355',
    simulationUrl: 'atomic-structure-explorer',
    title: 'Atomic Structure Explorer',
    image:
      'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=2006&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: false
  },
  {
    simulationId: '12356',
    simulationUrl: 'planetary-motion-simulator',
    title: 'Planetary Motion Simulator',
    image:
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: true
  },
  {
    simulationId: '12357',
    simulationUrl: 'quantum-mechanics-demo',
    title: 'Quantum Mechanics Demo',
    image:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: false
  },
  {
    simulationId: '12358',
    simulationUrl: 'thermodynamics-cycle',
    title: 'Thermodynamics Cycle',
    image:
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: true
  },
  {
    simulationId: '12359',
    simulationUrl: 'crystal-structure-viewer',
    title: 'Crystal Structure Viewer',
    image:
      'https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: false
  },
  {
    simulationId: '12360',
    simulationUrl: 'electromagnetic-spectrum',
    title: 'Electromagnetic Spectrum',
    image:
      'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: true
  },
  {
    simulationId: '12361',
    simulationUrl: 'dna-replication-process',
    title: 'DNA Replication Process',
    image:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2131&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: false
  },
  {
    simulationId: '12362',
    simulationUrl: 'solar-system-explorer',
    title: 'Solar System Explorer',
    image:
      'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isLocked: true
  }
];

export default cardData;
