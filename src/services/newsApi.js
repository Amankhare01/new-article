const BASE_URL = 'https://newsdata.io/api/1/latest';

/**
 * Maps NewsData.io raw category to standard app categories if needed.
 */
const mapCategory = (cat) => {
  if (!cat || cat.toLowerCase() === 'general') {
    return 'top';
  }
  return cat.toLowerCase();
};

/**
 * Creates a unique identifier fallback for an article if article_id is missing.
 */
const generateId = (item) => {
  if (item.article_id) return item.article_id;
  const sourceStr = (item.link || item.title || Math.random().toString());
  let hash = 0;
  for (let i = 0; i < sourceStr.length; i++) {
    const char = sourceStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'art_' + Math.abs(hash).toString(36);
};

/**
 * Normalizes a raw NewsData.io article object into a clean, predictable shape.
 */
export const normalizeArticle = (item) => {
  const hasPaidExcerptNotice = item.content && typeof item.content === 'string' && item.content.includes('ONLY AVAILABLE IN PAID PLANS');
  const validContent = (item.content && !hasPaidExcerptNotice) ? item.content : (item.description || '');

  let creatorStr = null;
  if (Array.isArray(item.creator) && item.creator.length > 0) {
    creatorStr = item.creator.filter(Boolean).join(', ');
  } else if (typeof item.creator === 'string') {
    creatorStr = item.creator;
  }

  let catStr = 'general';
  if (Array.isArray(item.category) && item.category.length > 0) {
    catStr = item.category[0];
  } else if (typeof item.category === 'string') {
    catStr = item.category;
  }

  return {
    id: generateId(item),
    title: item.title || 'Untitled Article',
    description: item.description || '',
    content: validContent,
    image_url: item.image_url || null,
    link: item.link || '#',
    source_id: item.source_id || 'news',
    source_name: item.source_name || item.source_id || 'News Source',
    source_icon: item.source_icon || null,
    pubDate: item.pubDate || new Date().toISOString(),
    creator: creatorStr,
    category: catStr,
  };
};

/**
 * Fetches news articles from NewsData.io by category.
 * @param {Object} options
 * @param {string} [options.category='top']
 * @param {string} [options.page=null]
 * @param {string} [options.country='in']
 * @returns {Promise<{articles: Array, nextPage: string|null}>}
 */
export const fetchNewsByCategory = async ({ category = 'top', page = null, country = 'in' } = {}) => {
  const apiKey = process.env.REACT_APP_NEWSDATA_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_newsdata_api_key_here') {
    throw new Error('API_KEY_MISSING');
  }

  const mappedCat = mapCategory(category);
  const params = new URLSearchParams({
    apikey: apiKey,
    country: country,
    language: 'en',
  });

  if (mappedCat) {
    params.append('category', mappedCat);
  }

  if (page) {
    params.append('page', page);
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  const data = await response.json();

  if (!response.ok || data.status === 'error') {
    const errorMsg = data?.results?.message || data?.message || `API error (${response.status})`;
    if (response.status === 429 || (errorMsg && errorMsg.toLowerCase().includes('rate limit'))) {
      throw new Error('RATE_LIMIT_EXCEEDED');
    }
    throw new Error(errorMsg);
  }

  const rawResults = data.results || [];
  const articles = rawResults.map(normalizeArticle);

  return {
    articles,
    nextPage: data.nextPage || null,
    totalResults: data.totalResults || articles.length,
  };
};

/**
 * Searches news articles on NewsData.io by query string.
 * @param {Object} options
 * @param {string} options.query
 * @param {string} [options.page=null]
 * @param {string} [options.country='in']
 * @returns {Promise<{articles: Array, nextPage: string|null}>}
 */
export const searchNews = async ({ query, page = null, country = 'in' }) => {
  const apiKey = process.env.REACT_APP_NEWSDATA_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_newsdata_api_key_here') {
    throw new Error('API_KEY_MISSING');
  }

  if (!query || query.trim() === '') {
    return { articles: [], nextPage: null, totalResults: 0 };
  }

  const params = new URLSearchParams({
    apikey: apiKey,
    country: country,
    language: 'en',
    q: query.trim(),
  });

  if (page) {
    params.append('page', page);
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  const data = await response.json();

  if (!response.ok || data.status === 'error') {
    const errorMsg = data?.results?.message || data?.message || `API error (${response.status})`;
    if (response.status === 429 || (errorMsg && errorMsg.toLowerCase().includes('rate limit'))) {
      throw new Error('RATE_LIMIT_EXCEEDED');
    }
    throw new Error(errorMsg);
  }

  const rawResults = data.results || [];
  const articles = rawResults.map(normalizeArticle);

  return {
    articles,
    nextPage: data.nextPage || null,
    totalResults: data.totalResults || articles.length,
  };
};
