import { useEffect, useState } from 'react';

import MainLayout from '../../components/Layout/';
import publicApi from '../../api/publicApi';

import { Carousel } from '../../components/Carousel';
import AnimatedCounter from '../../components/AnimatedCounter/AnimatedCounter';

const _renderSection = ({ sectionId, sectionLabel, sectionTitle, sectionCopy, cardData, isFromSimulation = false }) => (
  <section id={sectionId} className="mt-6 pt-6">
    <div>
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/82 px-3 py-1 text-xs font-bold text-blue-700 uppercase tracking-wide">
          {sectionLabel}
        </span>
        <h3 className="mb-2 mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">{sectionTitle}</h3>
      </div>
      <p className="text-slate-600 leading-relaxed">{sectionCopy}</p>
    </div>
    <Carousel items={cardData} isFromSimulation={isFromSimulation} />
  </section>
);

const _renderHeroMetric = (label, value) => {
  let display;
  if (typeof value === 'number') {
    display = <AnimatedCounter to={value} from={0} duration={1} startWhen separator="," />;
  } else if (typeof value === 'string') {
    const m = value.match(/^(\d+)(\+)?$/);
    if (m) {
      const num = parseInt(m[1], 10);
      const plus = !!m[2];
      display = plus ? (
        <>
          <AnimatedCounter to={num} from={0} duration={1} startWhen separator="," />+
        </>
      ) : (
        <AnimatedCounter to={num} from={0} duration={1} startWhen separator="," />
      );
    } else {
      display = value;
    }
  } else {
    display = value;
  }

  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white/70 p-4">
      <span className="text-2xl font-extrabold text-slate-900">{display}</span>
      <span className="text-sm font-semibold text-slate-500">{label}</span>
    </div>
  );
};

const _useFetchSimulations = ({ setLoading, setSimulations, setArticles }) => {
  useEffect(() => {
    const fetchSimulations = async () => {
      setLoading(true);
      try {
        const res = await publicApi.get('/simulations/public');
        const { data } = res.data;
        setSimulations(data);
      } catch (error) {
        setLoading(false);
      }
      setLoading(false);
    };
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await publicApi.get('/articles');
        const { data } = res.data;
        setArticles(data);
      } catch (error) {
        setLoading(false);
      }
      setLoading(false);
    };

    Promise.all([fetchSimulations(), fetchArticles()]);
  }, [setArticles, setLoading, setSimulations]);
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [simulations, setSimulations] = useState([]);
  const [articles, setArticles] = useState([]);

  _useFetchSimulations({ setLoading, setSimulations, setArticles });
  const simulationCount = simulations.length;
  const articleCount = articles.length;
  const isDataReady = simulationCount > 0 || articleCount > 0;

  return (
    <MainLayout>
      <section className="mx-auto max-w-7xl px-4 md:px-10">
        <div className="grid sm:grid-cols-2 items-center gap-8 mb-14 rounded-3xl border border-white/70 bg-gradient-to-br from-white/95 via-blue-50/82 to-blue-50/80 p-8 shadow-2xl backdrop-blur-lg">
          <div className="flex flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-white/82 px-3 py-1 text-xs font-bold text-blue-700 uppercase">
              Curiosity, rendered with depth
            </span>
            <h1 className="m-0 max-w-3xl text-4xl font-extrabold text-slate-900 leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Explore science through vivid simulations and story-driven articles.
            </h1>
            <p className="m-0 max-w-2xl text-base text-slate-600 leading-relaxed">
              A calmer, more cinematic way to browse the library. Pick up an experiment, open a new idea, and keep
              moving through the material that makes you want to learn more.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                className="inline-flex items-center justify-center min-h-[50px] rounded-full bg-brand-primary px-6 py-3 text-white font-semibold hover:bg-brand-primary-hover hover:text-slate-50 transition-colors"
                href="#simulations"
              >
                Start simulations
              </a>
              <a
                className="inline-flex items-center justify-center min-h-[50px] rounded-full border border-brand-secondary bg-white px-6 py-3 text-brand-primary hover:text-brand-primary font-semibold hover:bg-brand-secondary/20 hover:border-brand-primary transition-colors"
                href="#articles"
              >
                Read articles
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-5 text-white shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white bg-white/8 px-3 py-1 text-xs font-bold text-white uppercase tracking-wide">
                Featured paths
              </span>
              <span className="text-sm">Swipe through the latest picks</span>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/12 bg-gradient-to-br from-blue-500/30 to-blue-400/15 p-5">
                <span className="inline-block mb-2 text-xs font-bold text-white uppercase tracking-wide">
                  Interactive
                </span>
                <strong className="block mb-1 text-lg">See science in motion.</strong>
                <p className="m-0 text-white/80 leading-relaxed">
                  Open a simulation and move from explanation to experiment without leaving the page.
                </p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/8 p-5">
                <span className="inline-block mb-2 text-xs font-bold text-white uppercase tracking-wide">Reading</span>
                <strong className="block mb-1 text-lg">Short, focused articles.</strong>
                <p className="m-0 text-white/80 leading-relaxed">
                  Browse ideas that are easy to enter and rewarding to finish.
                </p>
              </div>
            </div>
          </div>
        </div>

        {_renderSection({
          sectionId: 'simulations',
          sectionLabel: 'Simulation library',
          sectionTitle: 'Explore the most tactile ideas first.',
          sectionCopy:
            'Each simulation is presented like a visual object, so the page feels alive as you move through the content.',
          cardData: simulations,
          isFromSimulation: true
        })}

        {_renderSection({
          sectionId: 'articles',
          sectionLabel: 'Editorial picks',
          sectionTitle: 'Follow the questions that deserve a deeper read.',
          sectionCopy:
            'The article stream stays light and easy to scan, with enough contrast to make each card feel distinct.',
          cardData: articles
        })}

        {!isDataReady && (
          <div className="mt-4 rounded-xl border border-dashed border-blue-300 bg-white/64 p-4 text-center text-slate-600">
            <span>Loading the featured collection...</span>
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default Home;
