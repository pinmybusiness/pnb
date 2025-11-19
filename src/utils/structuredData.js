// src/utils/structuredData.js
export function getStructuredData(article, commentsMeta, faqs = []) {
  // Main BlogPosting schema 
  const blogPostingData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.description || '',
    "image": article.featured_image ? [article.featured_image] : ["https://www.fasterq.in/images/trackly/hero-image.png"],
    "author": {
      "@type": "Person",
      "name": article.author_username || "FasterQ Team"
    },
    "datePublished": article.created_on,
    "dateModified":  article.updated_on,
    "publisher": {
      "@type": "Organization",
      "name": "FasterQ",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.fasterq.in/favicon.png",
        "width": 50,
        "height": 50
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_WEBSITE_URL}/${article.slug}`
    },

  };

  // Add article body if available
  if (article.content) {
    blogPostingData.articleBody = article.content;
  }

  // Add keywords if available
  if (article.keywords) {
    blogPostingData.keywords = article.keywords;
  }

  // Add rating if available
  if (commentsMeta.total_comments_count > 0) {
    blogPostingData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": commentsMeta.avg_rating,
      "ratingCount": commentsMeta.total_comments_count,
      "bestRating": 5,
      "worstRating": 1
    };
  }

  // FAQ Schema (NEW ADDITION)
  const faqData = faqs?.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // Return both schemas
  return {
    blogPosting: blogPostingData,
    ...(faqData && { faqPage: faqData }) // Only include if FAQs exist
  };
}