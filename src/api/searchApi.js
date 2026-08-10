import publicApi from './publicApi';

export const searchApi = {
  search: (query) => publicApi.get('/search', { params: { query } })
};
