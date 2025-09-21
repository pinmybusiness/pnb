export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { authService } from '@/services/authService';
import { Providers } from '../../providers';
import OpportunitiesContent from '@/components/csr/OpportunitiesContent';
import FAQs from '@/components/FAQs';
import ContentSection from '@/components/ContentSection';
import { notFound } from 'next/navigation';
import slugify from 'slugify';
import { getCityFAQs, getRoleCityFAQs, getRoleFAQs, getGeneralFAQs } from '@/data/faqs';
import { getCityContent, getRoleCityContent, getRoleContent, getGeneralContent } from '@/data/content';
import { Award, Briefcase } from 'lucide-react';
import sanitizeHtml from 'sanitize-html';
import { generateJobPostingSchema } from '@/utils/jobSchemaUtils';

// HeroSection component for SSR
function HeroSection({ pageTitle, isAuthenticated, description }) {
  return (
    <div className="relative bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 md:p-8 mb-8 md:mb-12 shadow-sm">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug md:leading-tight">
          {pageTitle}
        </h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-700 px-2">
          {description}
        </p>
        {!isAuthenticated && (
          <div className="mt-5 sm:mt-6 inline-flex items-center bg-white border border-orange-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-orange-700 shadow-sm">
            <Award className="w-4 h-4 mr-2" />
            Create a free account to apply and track your applications
          </div>
        )}
      </div>
      <div className="absolute right-3 sm:right-6 top-3 sm:top-6 hidden md:block opacity-10 text-orange-500">
        <Briefcase className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32" />
      </div>
    </div>
  );
}

// Generate dynamic metadata
export async function generateMetadata({ params }) {
  const { slug = [] } = params || {};
  const city = slug[0];
  const role = slug[1];

  if (!city && !role) {
    return {
      title: "Latest Restaurant Job Openings | Chefs, Waiters & More",
      description: "Browse the newest restaurant job listings. Find chef, steward, and waiter openings near you and apply free on FasterQ.in.",
      alternates: {
        canonical: "https://www.fasterq.in/jobs",
      },
    };
  }

  const capitalizedCity = city ? city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, ' ') : null;
  const capitalizedRole = role ? role.charAt(0).toUpperCase() + role.slice(1).replace(/-/g, ' ') : null;

  if (city && role) {
    return {
      title: `${capitalizedRole} Jobs in ${capitalizedCity} Restaurants | FasterQ.in`,
      description: `Find ${capitalizedRole} openings in ${capitalizedCity} restaurants. Apply free and start working faster with FasterQ.in.`,
      alternates: {
        canonical: `https://www.fasterq.in/jobs/${slugify(city, { lower: true })}/${slugify(role, { lower: true })}`,
      },
    };
  }

  if (city && !role) {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public`;
    const response = await fetch(`${baseUrl}?page=1&limit=12&workTypeSlug=${encodeURIComponent(city)}`, {
      headers: { 'Cache-Control': 'no-store' },
      next: { revalidate: 300 },
    });
    const data = await response.json();
    const isRole = data.success && data.data.some((opp) => opp.workTypeSlug === city);

    if (isRole) {
      return {
        title: `${capitalizedCity} Jobs in Restaurants | Apply Free on FasterQ.in`,
        description: `Explore ${capitalizedCity} job openings in restaurants. Apply free and get hired faster through FasterQ.in.`,
        alternates: {
          canonical: `https://www.fasterq.in/jobs/${slugify(city, { lower: true })}`,
        },
      };
    }

    return {
      title: `Restaurant Jobs in ${capitalizedCity} | Chefs, Waiters & More`,
      description: `Find restaurant job openings in ${capitalizedCity}. Apply for chef, steward, waiter, and kitchen staff roles free on FasterQ.in.`,
      alternates: {
        canonical: `https://www.fasterq.in/jobs/${slugify(city, { lower: true })}`,
      },
    };
  }
}

export default async function JobsPage({ params, searchParams }) {
  const { slug = [] } = params || {};
  const { page = 1, limit = 12 } = searchParams || {};

  const city = slug[0];
  const role = slug[1];

  let opportunities = [];
  let appliedOpportunities = [];
  let isAuthenticated = false;
  let isCity = false;
  let isRole = false;
  let paginationData = { current: 1, total: 1, totalRecords: 0 }; // Initialize pagination data
  
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public`;
  
  try {
    let url = `${baseUrl}?page=1&limit=${limit}`;
    if (city && role) {
      url += `&search=${encodeURIComponent(city)}&workTypeSlug=${encodeURIComponent(role)}`;
    } else if (city) {
      url += `&search=${encodeURIComponent(city)}`;
    }
    
    const response = await fetch(url, {
      headers: { 'Cache-Control': 'no-store' },
      next: { revalidate: 300 },
    });
    const data = await response.json();
    if (data.success) {
      opportunities = data.data || [];
      paginationData = data.pagination || { current: 1, total: 1, totalRecords: opportunities.length }; // Store pagination data
      if (city) {
        isCity = opportunities.some((opp) => {
          const cityName = opp.location?.city || opp.branch?.location?.city?.name;
          if (!cityName) {
            console.warn(`Missing city name for opportunity ID: ${opp._id}`, opp);
            return false;
          }
          return slugify(cityName, { lower: true }) === city.toLowerCase();
        });
        isRole = opportunities.some((opp) => opp.workTypeSlug === city);
      }
      if (role) {
        isRole = opportunities.some((opp) => opp.workTypeSlug === role);
      }
    } else {
      console.error('Failed to fetch opportunities:', data.message);
    }

    if (city && !isCity && !isRole && !role) {
      const roleResponse = await fetch(`${baseUrl}?page=${page}&limit=${limit}&workTypeSlug=${encodeURIComponent(city)}`, {
        headers: { 'Cache-Control': 'no-store' },
        next: { revalidate: 300 },
      });
      const roleData = await roleResponse.json();
      if (roleData.success) {
        opportunities = roleData.data || [];
        paginationData = roleData.pagination || { current: 1, total: 1, totalRecords: opportunities.length }; // Store pagination data
        isRole = opportunities.some((opp) => opp.workTypeSlug === city);
      }
    }
    
    if (city && !isCity && !isRole) {
      console.log('Triggering 404: No match for city or role');
      return notFound();
    }
    if (city && role && (!isCity || !isRole)) {
      console.log('Triggering 404: No match for city and role');
      return notFound();
    }
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return notFound();
  }
  
  const token = cookies().get('token')?.value;
  if (token) {
    try {
      const userData = await authService.getMe(token);
      if (userData.success && userData.data.role === 10) {
        isAuthenticated = true;
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 300 },
          });
          const data = await response.json();
          if (data.success) {
            appliedOpportunities = data.data.map((app) => app.opportunity._id);
          } else {
            console.error('Failed to fetch applications:', data.message);
          }
        } catch (error) {
          console.error('Error fetching applications:', error);
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  }

  const capitalizedCity = city ? city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, ' ') : null;
  const capitalizedRole = role ? role.charAt(0).toUpperCase() + role.slice(1).replace(/-/g, ' ') : null;
  let title;
  if (city && role) {
    title = `${capitalizedRole} Jobs in ${capitalizedCity}`;
  } else if (city && isCity) {
    title = `Restaurant Jobs in ${capitalizedCity}`;
  } else if (city && isRole) {
    title = `${capitalizedCity} Jobs in Restaurants`;
  } else {
    title = 'Explore Restaurant Job Listings';
  }
  
  let description;
  if (city && role) {
    description = `Searching for ${capitalizedRole} jobs in ${capitalizedCity}? FasterQ.in lists verified openings in hotels, restaurants, cafes, and pubs across the city. Explore opportunities for freshers, experienced candidates, and female staff with clear details on salary, benefits, and shifts. Whether you’re applying for hotel, continental, or executive ${capitalizedRole} roles, you can connect with employers directly and apply online for free—getting hired faster.`;
  } else if (city && isCity) {
    description = `Looking for restaurant jobs in ${capitalizedCity}? FasterQ.in helps job seekers connect with hotels, cafes, pubs, and restaurants that are hiring now. From chef and steward roles to part-time and urgent vacancies, explore verified job openings with clear details on salary, benefits, and contact information. Apply online for free and get hired faster.`;
  } else if (city && isRole) {
    description = `Looking for the latest ${capitalizedCity} jobs in India? FasterQ.in connects job seekers with verified openings in hotels, restaurants, cafes, and pubs nationwide. Whether you are a fresher, experienced professional, or female candidate, you can explore listings with clear details on salary, benefits, and shifts. Apply online for free and find the right ${capitalizedCity} opportunity faster.`;
  } else {
    description = `Explore opportunities across Kitchen, Service, Management, Marketing, Delivery and more. Kickstart your career in the food & hospitality industry today.`;
  }

  let faqs = [];
  if (city && role) {
    faqs = getRoleCityFAQs(capitalizedRole, capitalizedCity);
  } else if (city && isCity) {
    faqs = getCityFAQs(capitalizedCity);
  } else if (city && isRole) {
    faqs = getRoleFAQs(capitalizedCity);
  } else {
    faqs = getGeneralFAQs();
  }

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": sanitizeHtml(faq.question, { allowedTags: [] }),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": sanitizeHtml(faq.answer, { allowedTags: [] })
      }
    }))
  } : null;

  // Generate JobPosting schemas for ItemList
  const jobSchemas = opportunities.slice(0, 12).map((opp) => generateJobPostingSchema(opp));

  const itemListSchema = opportunities.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": jobSchemas.map((schema, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": schema
    }))
  } : null;

  const schemas = [faqSchema, itemListSchema].filter(Boolean);

  let content = '';
  if (city && role) {
    content = getRoleCityContent(capitalizedRole, capitalizedCity);
  } else if (city && isCity) {
    content = getCityContent(capitalizedCity);
  } else if (city && isRole) {
    content = getRoleContent(capitalizedCity);
  } else {
    content = getGeneralContent();
  }

  const initialFilters = {
    opportunityType: '',
    location: isCity ? city : '',
    minStipend: '',
    search: role || (isRole ? city : ''),
    baseSearch: isCity ? city : '',
    baseWorkTypeSlug: role || (isRole ? city : ''),
  };

  return (
    <div className="min-h-screen bg-[#FFF5EC]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSection pageTitle={title} isAuthenticated={isAuthenticated} description={description} />
        <Providers>
          <OpportunitiesContent
            initialOpportunities={opportunities}
            initialAppliedOpportunities={appliedOpportunities}
            isAuthenticated={isAuthenticated}
            pageTitle={title}
            initialFilters={initialFilters}
            initialPagination={paginationData} // Pass the pagination data
            basePath={city && role ? `/jobs/${city}/${role}` : city ? `/jobs/${city}` : '/jobs'}
          />
        </Providers>
        <div className="mt-10">
          <FAQs faqs={faqs} />
          <ContentSection content={content} />
        </div>
      </div>
    </div>
  );
}