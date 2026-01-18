'use client';

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

// Hook for Hourly Distribution
export const useHourlyDistribution = (period = "today", date = null) => {
  return useQuery({
    queryKey: ["hourly-distribution", period, date],
    queryFn: async () => {
      let url = `/api/v1/calls/hourly-distribution?period=${period}`;
      if (date) {
        url += `&date=${date}`;
      }
      
      const { data } = await apiClient.get(url);
      
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch hourly distribution");
      }
      
      return data.data;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};

// Hook for Trends Data
export const useTrendsData = (period = "week", type = "daily", date = null) => {
  return useQuery({
    queryKey: ["trends-data", period, type, date],
    queryFn: async () => {
      let url = `/api/v1/calls/trends?period=${period}&type=${type}`;
      if (date) {
        url += `&date=${date}`;
      }
      
      const { data } = await apiClient.get(url);
      
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch trends data");
      }
      
      return data.data;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};

// Hook for Top Callers
export const useTopCallers = (limit = 20, period = "month", type = "all") => {
  return useQuery({
    queryKey: ["top-callers", limit, period, type],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/api/v1/calls/top-callers?limit=${limit}&period=${period}&type=${type}`
      );
      
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch top callers");
      }
      
      return data.data;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};