'use client';

export default function myImageLoader({ src, width, quality }) {
  const isLocal = !src.startsWith('http');
  const query = new URLSearchParams();

  const imageOptimizationApi = 'https://images.mkutay.dev';
  // Your NextJS application URL
  const baseUrl = 'https://kcldnd.uk';

  const fullSrc = `${baseUrl}${src}`;

  if (width) query.set('width', width);
  if (quality) query.set('quality', quality);

  if (process.env.NODE_ENV === 'development' || process.env.SITE_URL === "http://localhost:3000") {
    return src;
  }

  if (isLocal) {
    return `${imageOptimizationApi}/image/${fullSrc}?${query.toString()}`;
  }
  
  return `${imageOptimizationApi}/image/${src}?${query.toString()}`;
}