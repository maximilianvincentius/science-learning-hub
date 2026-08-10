import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout';
import Button from '../../components/Chip/Chip.component';
import { Typography, Spin, Skeleton } from 'antd';
const { Title } = Typography;
import Card from '../../components/Card/Card';
import { useState, useEffect, useRef, useCallback } from 'react';
import publicApi from '../../api/publicApi';

const categories = ['Fields', 'Motion', 'Nature of Matter', 'Wave Behaviour'];
const LIMIT_ITEM_PER_PAGE = 10; // Number of items per page
const LOADING_TIMEOUT = 1000; // 1 second timeout for demonstration
const FILTER_DEBOUNCE = 500; // debounce ms after filter click before fetching

const _handleCategoryClick = (category, setSelectedCategories) => () => {
  setSelectedCategories((prevCategories) => {
    const categoryExists = prevCategories.includes(category);
    if (categoryExists) {
      return prevCategories.filter((cat) => cat !== category);
    }
    return [...prevCategories, category];
  });
};

const _renderMobileCategories = (categories, selectedCategories, setSelectedCategories) => {
  return (
    <div className="flex w-full flex-nowrap gap-4 overflow-x-auto overflow-y-hidden py-2 px-2 scrollbar-hide mt-20">
      {categories.map((category) => (
        <Button
          key={category}
          text={category}
          onClick={_handleCategoryClick(category, setSelectedCategories)}
          isActive={selectedCategories.includes(category)}
        />
      ))}
    </div>
  );
};

const _renderSearchResult = (loading, totalItems) => {
  return (
    <div className="py-2 px-3">
      {loading && <Skeleton paragraph={{ rows: 0, columns: 2 }} className="w-48" />}
      {!loading && <Title level={5}>{`${totalItems} Results`}</Title>}
    </div>
  );
};

const _renderCard = (card, lastSimulationElementRef = null) => (
  <Link
    className="flex"
    to={`/article/${card._id}`}
    key={card._id}
    {...(lastSimulationElementRef ? { ref: lastSimulationElementRef } : {})}
  >
    <Card
      containImage={false}
      itemId={card._id}
      title={card.title}
      description={card.content}
      topic={card.topic}
      author={card.author}
      updatedAt={card.updatedAt}
    />
  </Link>
);

const _renderSkeletonCards = (count) => {
  const skeletons = [];
  for (let i = 0; i < count; i++) {
    skeletons.push(
      <div key={`skeleton-${i}`} className="flex flex-col gap-5">
        <Skeleton.Image active style={{ width: '100%' }} />
        <Skeleton paragraph={{ rows: 0 }} style={{ width: 250 }} />
      </div>
    );
  }
  return skeletons;
};

const renderContent = (loading, simulations, totalItems, lastSimulationElementRef) => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10 py-2 pb-0 justify-items-center">
      {loading && simulations.length === 0 && _renderSkeletonCards(totalItems)}
      {simulations.map((card, index) => {
        if (simulations.length === index + 1) {
          return _renderCard(card, lastSimulationElementRef);
        }

        return _renderCard(card);
      })}
      {loading && simulations.length > 0 && _renderSkeletonCards(totalItems)}
    </div>
  );
};

const _useFetchSimulations = (state) => {
  const { page, selectedCategories, setSimulations, setTotalPages, setTotalItems, setHasMore, setLoading, hasMore } =
    state;

  useEffect(() => {
    const controller = new AbortController();
    let timeoutId = null;

    const fetchSimulations = async () => {
      if (page !== 1 && !hasMore) {
        return;
      }

      setLoading(true);
      try {
        const categoryQuery =
          selectedCategories && selectedCategories.length > 0 ? `&categories=${selectedCategories.join(',')}` : '';
        const res = await publicApi.get(`/articles?page=${page}&limit=${LIMIT_ITEM_PER_PAGE}${categoryQuery}`, {
          signal: controller.signal
        });

        const { data, currentPage, totalPages, totalItems } = res.data;

        timeoutId = setTimeout(() => {
          if (controller.signal.aborted) {
            return;
          }

          setSimulations((prevSimulations) => (page === 1 ? data : [...prevSimulations, ...data]));
          setTotalPages(totalPages);
          setTotalItems((prevItems) => (page === 1 ? totalItems : totalItems + prevItems));
          setHasMore(currentPage < totalPages);
          setLoading(false);
        }, LOADING_TIMEOUT);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        setLoading(false);
      }
    };

    fetchSimulations();

    return () => {
      controller.abort();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [page, selectedCategories]);
};

const _lastSimulationCallback = (node, loading, hasMore, setPage, observer) => {
  if (loading) {
    return;
  }

  if (observer.current) {
    observer.current.disconnect();
  }
  observer.current = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  });

  if (node) {
    observer.current.observe(node);
  }
};

const _useInfiniteScroll = (loading, hasMore, setPage) => {
  const observer = useRef();

  const lastSimulationElementRef = useCallback(
    (node) => _lastSimulationCallback(node, loading, hasMore, setPage, observer),
    [loading, hasMore]
  );

  return lastSimulationElementRef;
};

const Simulation = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [debouncedSelectedCategories, setDebouncedSelectedCategories] = useState(selectedCategories);
  const [simulations, setSimulations] = useState([]);
  const [page, setPage] = useState(1);
  const [_, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(LIMIT_ITEM_PER_PAGE);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // debounce selectedCategories updates
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSelectedCategories(selectedCategories);
    }, FILTER_DEBOUNCE);

    return () => clearTimeout(t);
  }, [selectedCategories]);

  // when debounced categories change, reset list and page (fetch will run after page change)
  useEffect(() => {
    setSimulations([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSelectedCategories]);

  _useFetchSimulations({
    page,
    selectedCategories: debouncedSelectedCategories,
    setPage,
    setSimulations,
    setTotalPages,
    setTotalItems,
    setHasMore,
    setLoading,
    hasMore
  });

  // Infinite scroll logic
  const lastSimulationElementRef = _useInfiniteScroll(loading, hasMore, setPage);

  return (
    <MainLayout>
      {/* {_renderMobileCategories(categories, selectedCategories, setSelectedCategories)} */}
      {/* {_renderSearchResult(loading, totalItems)} */}
      {renderContent(loading, simulations, totalItems, lastSimulationElementRef)}

      {!hasMore && simulations.length > 0 && !loading && (
        <div className="flex justify-center p-4 text-gray-500">You've reached the end of the results.</div>
      )}
    </MainLayout>
  );
};

export default Simulation;
