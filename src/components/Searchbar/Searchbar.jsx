import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from 'antd';
import { SearchOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { SearchBarPropTypes, SearchBarDefaultProps } from './SearchBar.types';
import publicApi from '../../api/publicApi';
import './Searchbar.css';

const DEBOUNCE_MS = 300;

const TRENDING_SEARCHES = [
  'Space, Time, and Motion',
  'The Particulate Nature Matter',
  'Wave Behaviour',
  'Fields',
  'Nuclear & Quantum Physics'
];

const SearchBar = (props) => {
  const { enableBackButton, imgUrl } = props;
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [simulations, setSimulations] = useState([]);
  const [articles, setArticles] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSimulations([]);
      setArticles([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const res = await publicApi.get('/search', { params: { keyword: trimmed } });
        const data = res.data?.data ?? res.data ?? {};
        setSimulations(data.simulations ?? []);
        setArticles(data.articles ?? []);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        if (!controller.signal.aborted) {
          setSearchError('Failed to load search results. Please try again.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trimmedQuery = query.trim().toLowerCase();
  const hasResults = simulations.length > 0 || articles.length > 0;
  const showEmpty = trimmedQuery && !isSearching && !searchError && !hasResults;

  const totalItemsCount = simulations.length + articles.length;

  const executeSearch = useCallback(
    (searchTerm) => {
      setQuery(searchTerm);
      setIsOpen(false);
      inputRef.current?.blur();
      navigate(`/simulation?search=${encodeURIComponent(searchTerm)}`);
    },
    [navigate]
  );

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    setIsSubmitLoading(true);
    executeSearch(trimmed);
    setIsSubmitLoading(false);
  }, [query, executeSearch]);

  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) {
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 >= totalItemsCount ? 0 : prev + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalItemsCount - 1));
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < totalItemsCount) {
          if (selectedIndex < simulations.length) {
            const simulation = simulations[selectedIndex];
            navigate(`/simulation/${simulation.simulationUrl || simulation.id}`);
          } else {
            const article = articles[selectedIndex - simulations.length];
            navigate(`/articles/${article.id}`);
          }
          setIsOpen(false);
          inputRef.current?.blur();
        } else {
          handleSearch();
        }
      }
    },
    [isOpen, totalItemsCount, simulations, articles, selectedIndex, navigate, handleSearch, inputRef]
  );

  const handleClear = (e) => {
    e.stopPropagation();
    setQuery('');
    setSelectedIndex(-1);
    setSimulations([]);
    setArticles([]);
    setSearchError(null);
    inputRef.current?.focus();
  };

  const handlePillClick = (val) => {
    executeSearch(val);
  };

  const renderHighlightedText = (text, highlight) => {
    if (!highlight) {
      return <span>{text}</span>;
    }
    const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <strong key={i} className="font-bold text-slate-900">
              {part}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full z-50" onKeyDown={handleKeyDown}>
      <div className={`flex items-center w-full ${enableBackButton ? 'gap-5' : ''}`}>
        {enableBackButton && (
          <button className="back-button">
            <img src={imgUrl} alt="Back" />
          </button>
        )}
        <div className="relative w-full">
          <Input
            ref={inputRef}
            placeholder="Search"
            aria-label="Search"
            prefix={<SearchOutlined className="text-slate-500 mr-2" />}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="custom-search w-full"
            suffix={
              <div className="flex items-center gap-2">
                {isSearching && <LoadingOutlined className="text-slate-400 text-sm" />}
                {query && !isSearching && (
                  <button
                    onClick={handleClear}
                    className="p-1 hover:bg-slate-100 rounded-full transition-colors inline-flex items-center justify-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label="Clear search"
                  >
                    <CloseOutlined className="text-xs" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={isSubmitLoading}
                  className="search-submit-btn p-2 rounded-full inline-flex items-center justify-center transition-all duration-150"
                  aria-label="Search"
                >
                  {isSubmitLoading ? (
                    <LoadingOutlined className="text-white text-sm animate-spin" />
                  ) : (
                    <SearchOutlined className="text-white text-base" />
                  )}
                </button>
              </div>
            }
          />
        </div>
      </div>

      {isOpen && (
        <div className="search-dropdown-panel absolute left-0 right-0 mt-2 bg-white rounded-[24px] shadow-[0_15px_50px_rgba(15,23,42,0.15)] border border-slate-100 overflow-hidden animate-fade-slide-in">
          <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar flex flex-col gap-6">
            {!query ? (
              <>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Trending Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((term) => (
                      <button
                        key={term}
                        onClick={() => handlePillClick(term)}
                        className="px-4 py-2 text-sm bg-white border border-slate-200 text-slate-700 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600 transition-colors pointer-cursor"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : searchError ? (
              <div className="py-12 text-center">
                <p className="text-sm text-red-500">{searchError}</p>
              </div>
            ) : showEmpty ? (
              <div className="py-12 text-center">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="text-base font-semibold text-slate-800 mb-1">No results found</h3>
                <p className="text-sm text-slate-500 mb-6">Try different keywords</p>
                <div className="max-w-md mx-auto">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-left">
                    Suggestions
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-start">
                    {TRENDING_SEARCHES.slice(0, 6).map((term) => (
                      <button
                        key={term}
                        onClick={() => handlePillClick(term)}
                        className="px-4 py-2 text-sm bg-white border border-slate-200 text-slate-700 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600 transition-colors pointer-cursor"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {simulations.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Simulations</h3>
                    <div className="grid-cols-1 md:grid-cols-3 gap-4">
                      {simulations.map((simulation, i) => {
                        const isSelected = selectedIndex === i;
                        return (
                          <button
                            key={simulation.id}
                            onClick={() => {
                              navigate(`/simulation/${simulation.simulationId}`);
                              setIsOpen(false);
                            }}
                            className={`flex my-2 flex-col bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden hover:-translate-y-0.5 text-left ${
                              isSelected ? 'bg-sky-50 border-sky-200' : ''
                            }`}
                          >
                            <div className="p-4 flex flex-col flex-1">
                              <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 mb-1 group-hover:text-sky-600 transition-colors flex-1">
                                {renderHighlightedText(simulation.title, trimmedQuery)}
                              </h4>
                              {simulation.description && (
                                <p className="text-xs text-slate-500 line-clamp-2 mb-2">{simulation.description}</p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {articles.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Articles</h3>
                    <div className="flex flex-col">
                      {articles.map((article, i) => {
                        const globalIndex = simulations.length + i;
                        const isSelected = selectedIndex === globalIndex;
                        return (
                          <button
                            key={article.id}
                            onClick={() => {
                              navigate(`/article/${article._id}`);
                              setIsOpen(false);
                            }}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-colors text-slate-700 hover:bg-slate-50 hover:text-slate-950 ${
                              isSelected ? 'bg-slate-50 text-slate-950 font-medium' : ''
                            }`}
                          >
                            <SearchOutlined className="text-slate-400 text-sm shrink-0" />
                            <span className="text-sm">{renderHighlightedText(article.title, trimmedQuery)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = SearchBarPropTypes;
SearchBar.defaultProps = SearchBarDefaultProps;

export default SearchBar;
