import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import publicApi from '../../api/publicApi';
import Card from '../../components/Card/Card';

const { Title } = Typography;

const SearchResults = ({ searchQuery }) => {
  const [simulations, setSimulations] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    const controller = new AbortController();

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await publicApi.get('/search', {
          params: { keyword: searchQuery }
        });
        const { data } = res;
        setSimulations(data.simulations || []);
        setArticles(data.articles || []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSearchResults();

    return () => controller.abort();
  }, [searchQuery]);

  if (loading) {
    return <Skeleton active paragraph={{ rows: 4 }} />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="py-4">
      {simulations.length > 0 && (
        <div className="mb-8">
          <Title level={3} className="mb-2">
            Simulations
          </Title>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 py-2 pb-16 justify-items-center">
            {simulations.map((sim) => (
              <Link
                to={`/simulation/${sim.simulationId}`}
                key={sim.id}
                className="flex hover:-translate-y-1 transition-transform"
              >
                <Card itemId={sim.id} title={sim.title} image={sim.image} isLocked={sim.isLocked} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {articles.length > 0 && (
        <div className="mb-8">
          <Title level={3} className="mb-2">
            Articles
          </Title>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10 py-2 pb-0 justify-items-center">
            {articles.map((article) => (
              <Link className="flex" to={`/article/${article._id}`} key={article._id}>
                <Card
                  containImage={false}
                  itemId={article._id}
                  title={article.title}
                  description={article.content}
                  topic={article.topic}
                  author={article.author}
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {simulations.length === 0 && articles.length === 0 && (
        <div className="text-center py-10 text-gray-500">No results found for {searchQuery}</div>
      )}
    </div>
  );
};

SearchResults.propTypes = {
  searchQuery: PropTypes.string.isRequired
};

export default SearchResults;
