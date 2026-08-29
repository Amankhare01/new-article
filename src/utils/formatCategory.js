/**
 * Helper to capitalize a word or phrase properly.
 */
function capitalizeWord(word) {
  if (!word || typeof word !== 'string') return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Extracts a single primary category string suitable for API queries and router links.
 * @param {string|Array} category
 * @returns {string} - e.g. "health" or "general"
 */
export function getPrimaryCategory(category) {
  if (!category) return 'general';
  if (Array.isArray(category)) {
    const valid = category.find((c) => typeof c === 'string' && c.trim().length > 0);
    return valid ? valid.toLowerCase() : 'general';
  }
  if (typeof category === 'string' && category.trim().length > 0) {
    return category.toLowerCase();
  }
  return 'general';
}

/**
 * Formats category (array or string) into a clean, capitalized display string.
 * e.g., ["health", "lifestyle"] -> "Health · Lifestyle"
 * e.g., "business" -> "Business"
 * @param {string|Array} category
 * @param {number} [maxItems=2] - Maximum number of categories to join
 * @returns {string}
 */
export function formatCategoryDisplay(category, maxItems = 2) {
  if (!category) return 'General';

  let catList = [];
  if (Array.isArray(category)) {
    catList = category.filter((c) => typeof c === 'string' && c.trim().length > 0);
  } else if (typeof category === 'string' && category.trim().length > 0) {
    catList = [category];
  }

  if (catList.length === 0) return 'General';

  const formatted = catList
    .slice(0, maxItems)
    .map((c) => {
      const trimmed = c.trim();
      if (trimmed.toLowerCase() === 'top') return 'General';
      return capitalizeWord(trimmed);
    });

  return formatted.join(' · ');
}
