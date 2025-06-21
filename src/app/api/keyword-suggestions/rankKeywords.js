/**
 * Function to rank keywords based on CPC and search volume.
 * @param {Array} keywords - Array of keyword objects.
 * @returns {Array} - Ranked keywords.
 */
export function rankKeywords(keywords) {
  return keywords
    .map((keyword) => ({
      ...keyword,
      rank: keyword.cpc === 0 ? 0 : keyword.volume / keyword.cpc,
    }))
    .sort((a, b) => b.rank - a.rank);
}
