/**
 * Estimates reading time in minutes based on word count (~200 words per minute).
 * @param {string} text - The article content or description.
 * @returns {string} - Formatted reading time string (e.g., "1 min read").
 */
export function estimateReadTime(text) {
  if (!text || typeof text !== 'string') return '1 min read';
  
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  
  return `${minutes} min read`;
}
