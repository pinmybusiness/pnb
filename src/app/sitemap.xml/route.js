import { API_CONFIG } from "../../../config/api";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.fasterq.in";

  // static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // {
    //   url: `${baseUrl}/privacy-policy`,
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly',
    //   priority: 0.7,
    // },
    // {
    //   url: `${baseUrl}/terms-and-conditions`,
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly',
    //   priority: 0.7,
    // },
  ];

    // fetch blog from api
  let blogPosts = [];
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getAllSlugs}?website=${API_CONFIG.websiteId}`);
    const data = await response.json();
    
    if(data.statusCode === 200 && data.posts) {
      blogPosts = data.posts.map(post => ({
        url: `${baseUrl}/${post.slug}`,
        lastModified: new Date(post.updated_on),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }

  const allPages = [...staticPages, ...blogPosts];

  // XML generate
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(page => `
    <url>
      <loc>${page.url}</loc>
      <lastmod>${page.lastModified.toISOString()}</lastmod>
      <changefreq>${page.changeFrequency}</changefreq>
      <priority>${page.priority}</priority>
    </url>
  `).join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}