import { TOOLS, SITE } from '@/lib/tools';

export default function sitemap() {
  const toolUrls = TOOLS.map((tool) => ({
    url: `${SITE.url}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE.url}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    ...toolUrls,
    {
      url: `${SITE.url}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE.url}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
