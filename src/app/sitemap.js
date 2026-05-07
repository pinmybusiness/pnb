import { TOOLS, SITE } from '@/lib/tools';

export const dynamic = 'force-static';

// Stable build date — changes only when this file is rebuilt.
// Avoids constantly bumping lastmod which Google ignores anyway.
const BUILD_DATE = new Date();

export default function sitemap() {
  const toolUrls = TOOLS.map((tool) => ({
    url: `${SITE.url}${tool.href}`,
    lastModified: BUILD_DATE,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  return [
    {
      url: SITE.url,
      lastModified: BUILD_DATE,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE.url}/tools`,
      lastModified: BUILD_DATE,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    ...toolUrls,
    {
      url: `${SITE.url}/blog`,
      lastModified: BUILD_DATE,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE.url}/about`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE.url}/faq`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE.url}/contact`,
      lastModified: BUILD_DATE,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${SITE.url}/privacy-policy`,
      lastModified: BUILD_DATE,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${SITE.url}/terms-and-conditions`,
      lastModified: BUILD_DATE,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];
}
