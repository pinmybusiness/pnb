// src/app/jobs/[[...slug]]/page.jsx
export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { authService } from '@/services/authService';
import { Providers } from '../../providers';
import OpportunitiesContent from '@/components/csr/OpportunitiesContent';
import { notFound } from 'next/navigation';
import slugify from 'slugify';

export default async function JobsPage({ params, searchParams }) {
  const { slug = [] } = params || {};
  const { page = 1, limit = 20 } = searchParams || {};

  // Extract city and role from slug
  const city = slug[0];
  const role = slug[1];

  let opportunities = [];
  let appliedOpportunities = [];
  let isAuthenticated = false;
  let isCity = false;
  let isRole = false;

  // Base API URL
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public`;

  // Fetch opportunities based on slug
  try {
    let url = `${baseUrl}?page=${page}&limit=${limit}`;
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
      // Verify city or role matches
      if (city) {
        isCity = opportunities.some(
          (opp) => slugify(opp.branch?.location?.city?.name || '', { lower: true }) === city.name.toLowerCase()
        );
        isRole = opportunities.some((opp) => opp.workTypeSlug === city);
      }
      if (role) {
        isRole = opportunities.some((opp) => opp.workTypeSlug === role);
      }
    } else {
      console.error('Failed to fetch opportunities:', data.message);
    }

    // Try role-based search for /jobs/captain if city doesn't match
    if (city && !isCity && !isRole && !role) {
      const roleResponse = await fetch(`${baseUrl}?page=${page}&limit=${limit}&workTypeSlug=${encodeURIComponent(city)}`, {
        headers: { 'Cache-Control': 'no-store' },
        next: { revalidate: 300 },
      });
      const roleData = await roleResponse.json();
      if (roleData.success) {
        opportunities = roleData.data || [];
        isRole = opportunities.some((opp) => opp.workTypeSlug === city);
      }
    }

    // Trigger 404 if no valid matches
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

  // Check authentication and fetch applied opportunities
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

  // Dynamic title and initial filters
  const title = city && role ? `Jobs in ${city} for ${role}` : city ? (isCity ? `Jobs in ${city}` : `Jobs for ${city}`) : 'Restaurant & Hospitality Opportunities';
  const initialFilters = {
    category: '',
    opportunityType: '',
    location: isCity ? city : '',
    durationUnit: '',
    minStipend: '',
    search: role || (isRole ? city : ''),
    longitude: '',
    latitude: '',
    maxDistance: '5000',
    baseSearch: isCity ? city : '', // Preserve city for API queries
    baseWorkTypeSlug: role || (isRole ? city : ''), // Preserve role for API queries
  };

  return (
    <Providers>
      <OpportunitiesContent
        initialOpportunities={opportunities}
        initialAppliedOpportunities={appliedOpportunities}
        isAuthenticated={isAuthenticated}
        pageTitle={title}
        initialFilters={initialFilters}
        currentPage={parseInt(page)}
        totalPages={opportunities.pagination?.total || 1}
        basePath={city && role ? `/jobs/${city}/${role}` : city ? `/jobs/${city}` : '/jobs'}
      />
    </Providers>
  );
}

export async function generateMetadata({ params }) {
  const { slug = [] } = params || {};
  const city = slug[0];
  const role = slug[1];

  let title = 'Restaurant & Hospitality Opportunities';
  if (city && role) {
    title = `Jobs in ${city} for ${role} | Your Site`;
  } else if (city) {
    title = `Jobs in ${city} | Your Site`;
  }

  return {
    title,
    description: `Explore ${city ? `job opportunities in ${city}` : 'restaurant and hospitality opportunities'}${role ? ` for ${role}` : ''}. Find roles in kitchen, service, management, and more.`,
  };
}