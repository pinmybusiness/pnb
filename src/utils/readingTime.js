// src/utils/readingTime.js
export function getReadingTime(text) {
  if (!text) return '0 min';
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min`;
}