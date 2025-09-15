// src/app/jobs/[...slug]/page.jsx
import axios from 'axios';
import { notFound } from 'next/navigation';
import slugify from 'slugify';

export const dynamic = 'force-dynamic';

export default async function JobsPage({ params, searchParams }) {
  // Await params and searchParams
  const { slug = [] } = await params;
  const { page = 1, limit = 12 } = await searchParams;

  // slug can be [], [city], or [city, role]
  const city = slug[0];
  const role = slug[1];

  let opportunities = [];
  let pagination = {};
  let isCity = false;
  let isRole = false;

  try {
    console.log('Environment:', { apiUrl: process.env.NEXT_PUBLIC_API_URL });
    console.log('Requesting:', { city, role, page, limit });

    // If city and role both present (e.g., /jobs/hyderabad/chaat-master)
    if (city && role) {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public`, {
        params: { page, limit, search: city, workTypeSlug: role },
        headers: { 'Cache-Control': 'no-store' }
      });
      opportunities = response.data.data || [];
      pagination = response.data.pagination || {};
      console.log('City+Role API Response:', {
        city,
        role,
        opportunities: opportunities.length,
        first: opportunities[0]
      });

      isCity = opportunities.some(
        (opp) => slugify(opp.branch?.location?.city?.name || '', { lower: true }) === city.toLowerCase()
      );
      isRole = opportunities.some((opp) => opp.workTypeSlug === role);
      console.log('City Match:', isCity, 'Role Match:', isRole);

      if (!isCity || !isRole) {
        console.log('Triggering 404: No match for city and role');
        return notFound();
      }
    }
    // If only city or role (e.g., /jobs/hyderabad or /jobs/chaat-master)
    else if (city) {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public`, {
        params: { page, limit, search: city },
        headers: { 'Cache-Control': 'no-store' }
      });
      opportunities = response.data.data || [];
      pagination = response.data.pagination || {};
      console.log('City API Response:', { city, opportunities: opportunities.length, first: opportunities[0] });

      isCity = opportunities.some(
        (opp) => slugify(opp.branch?.location?.city?.name || '', { lower: true }) === city.toLowerCase()
      );
      console.log('City Match:', isCity);

      if (!isCity) {
        const roleResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public`, {
          params: { page, limit, workTypeSlug: city },
          headers: { 'Cache-Control': 'no-store' }
        });
        opportunities = roleResponse.data.data || [];
        pagination = roleResponse.data.pagination || {};
        console.log('Role API Response:', { city, opportunities: opportunities.length });

        isRole = opportunities.some((opp) => opp.workTypeSlug === city);
        console.log('Role Match:', isRole);
      }

      if (!isCity && !isRole) {
        console.log('Triggering 404: No match');
        return notFound();
      }
    } else {
      console.log('Triggering 404: No slug provided');
      return notFound();
    }
  } catch (error) {
    console.error('API Error Details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public?search=${city || ''}&workTypeSlug=${role || city || ''}&page=${page}&limit=${limit}`
    });
    return notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {city && role ? `Jobs in ${city} for ${role}` : isCity ? `Jobs in ${city}` : `Jobs for ${city}`}
      </h1>
      {opportunities.length === 0 ? (
        <p className="text-gray-600">No opportunities found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opp) => (
            <div key={opp._id} className="border rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-semibold">{opp.title}</h2>
              <p className="text-gray-600">
                {opp.branch?.name} - {opp.branch?.location?.city?.name}
              </p>
              <p className="text-gray-600">Role: {opp.workType?.name}</p>
              <p className="text-gray-600">Stipend: {opp.stipend?.amount} {opp.stipend?.currency}</p>
              <p className="text-gray-600">
                Posted: {new Date(opp.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
      {pagination.total > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pagination.total }, (_, i) => (
            <a
              key={i + 1}
              href={`/jobs/${city}${role ? `/${role}` : ''}?page=${i + 1}`}
              className={`px-4 py-2 rounded ${pagination.current === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {i + 1}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}