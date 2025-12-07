// src/components/blog/BlogSchema.jsx

export default function BlogSchema({ posts }) {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "FasterQ Blog - Call Tracking Guides & Business Growth Tips",
    "description":
      "Read the latest articles on call tracking, team performance, productivity tips, and how FasterQ helps businesses grow with smart call insights.",
    "mainEntity": {
      "@type": "Blog",
      "blogPost": posts.map((post) => ({
        "@type": "BlogPosting",
        "headline": post.heading_one,
        "url": `https://www.fasterq.in/${post.slug}`,
        "datePublished": post.created_on,
        "dateModified": post.updated_on,
        "image": post.image || "",
        "author": {
          "@type": "Person",
          "name": post.author_username || "Team FasterQ"
        }
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
    />
  );
}
