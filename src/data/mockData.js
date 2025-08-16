// Mock data for the restaurant analysis tool

export const restaurants = [
  {
    id: 1,
    name: "Bella Vista",
    logo: "🍝",
    address: "123 Main St, Downtown",
    createdAt: "2024-01-15",
    totalBranches: 3,
    activeBranches: 2,
    partneredBranches: 1
  },
  {
    id: 2,
    name: "Ocean Breeze",
    logo: "🌊",
    address: "456 Coastal Ave, Marina",
    createdAt: "2024-02-20",
    totalBranches: 2,
    activeBranches: 2,
    partneredBranches: 2
  },
  {
    id: 3,
    name: "Mountain Peak",
    logo: "⛰️",
    address: "789 Highland Rd, Hills",
    createdAt: "2024-03-10",
    totalBranches: 4,
    activeBranches: 3,
    partneredBranches: 1
  }
];

export const branches = [
  {
    id: 1,
    restaurantId: 1,
    name: "Bella Vista Downtown",
    location: "123 Main St, Downtown",
    status: "Partnered",
    reason: null,
    trialStartDate: "2024-01-15",
    trialDaysLeft: 0,
    footfall: 1250,
    reviews: 4.8,
    engagement: 85,
    revenue: 45600,
    teamCount: 8
  },
  {
    id: 2,
    restaurantId: 1,
    name: "Bella Vista Mall",
    location: "Shopping Center, Mall Rd",
    status: "In Progress",
    reason: "Waiting for equipment installation",
    trialStartDate: "2024-07-01",
    trialDaysLeft: 12,
    footfall: 800,
    reviews: 4.2,
    engagement: 72,
    revenue: 28400,
    teamCount: 6
  },
  {
    id: 3,
    restaurantId: 1,
    name: "Bella Vista Airport",
    location: "Terminal 2, International Airport",
    status: "Closed",
    reason: "Low footfall and high operational costs",
    trialStartDate: "2024-05-10",
    trialDaysLeft: 0,
    footfall: 320,
    reviews: 3.9,
    engagement: 45,
    revenue: 12100,
    teamCount: 4
  },
  {
    id: 4,
    restaurantId: 2,
    name: "Ocean Breeze Marina",
    location: "456 Coastal Ave, Marina",
    status: "Partnered",
    reason: null,
    trialStartDate: "2024-02-20",
    trialDaysLeft: 0,
    footfall: 950,
    reviews: 4.6,
    engagement: 78,
    revenue: 38200,
    teamCount: 7
  },
  {
    id: 5,
    restaurantId: 2,
    name: "Ocean Breeze Beach",
    location: "Beach Front, Sunset Boulevard",
    status: "Partnered",
    reason: null,
    trialStartDate: "2024-03-15",
    trialDaysLeft: 0,
    footfall: 1420,
    reviews: 4.9,
    engagement: 92,
    revenue: 52300,
    teamCount: 9
  },
  {
    id: 6,
    restaurantId: 3,
    name: "Mountain Peak Summit",
    location: "789 Highland Rd, Hills",
    status: "In Progress",
    reason: "Staff training in progress",
    trialStartDate: "2024-08-01",
    trialDaysLeft: 25,
    footfall: 650,
    reviews: 4.1,
    engagement: 68,
    revenue: 22800,
    teamCount: 5
  }
];

export const teams = [
  { id: 1, branchId: 1, name: "Marco Rodriguez", role: "Branch Manager", email: "marco@bellavista.com", joinDate: "2024-01-20" },
  { id: 2, branchId: 1, name: "Sarah Chen", role: "Assistant Manager", email: "sarah@bellavista.com", joinDate: "2024-02-15" },
  { id: 3, branchId: 1, name: "David Park", role: "Analyst", email: "david@bellavista.com", joinDate: "2024-03-01" },
  { id: 4, branchId: 2, name: "Lisa Thompson", role: "Branch Manager", email: "lisa@bellavista.com", joinDate: "2024-07-05" },
  { id: 5, branchId: 2, name: "Ahmed Hassan", role: "Analyst", email: "ahmed@bellavista.com", joinDate: "2024-07-10" },
  { id: 6, branchId: 4, name: "Maria Garcia", role: "Branch Manager", email: "maria@oceanbreeze.com", joinDate: "2024-02-25" },
  { id: 7, branchId: 5, name: "John Smith", role: "Branch Manager", email: "john@oceanbreeze.com", joinDate: "2024-03-20" },
  { id: 8, branchId: 6, name: "Emily Davis", role: "Branch Manager", email: "emily@mountainpeak.com", joinDate: "2024-08-05" }
];

export const performanceData = [
  { month: "Jan", footfall: 1200, revenue: 42000, engagement: 82 },
  { month: "Feb", footfall: 1100, revenue: 38500, engagement: 79 },
  { month: "Mar", footfall: 1350, revenue: 47200, engagement: 85 },
  { month: "Apr", footfall: 1280, revenue: 44800, engagement: 83 },
  { month: "May", footfall: 1400, revenue: 49600, engagement: 88 },
  { month: "Jun", footfall: 1550, revenue: 53200, engagement: 91 },
  { month: "Jul", footfall: 1480, revenue: 51100, engagement: 89 },
  { month: "Aug", footfall: 1380, revenue: 48300, engagement: 86 }
];

export const kpiData = {
  totalRestaurants: restaurants.length,
  totalBranches: branches.length,
  activeTrials: branches.filter(b => b.trialDaysLeft > 0).length,
  partneredBranches: branches.filter(b => b.status === "Partnered").length,
  totalRevenue: branches.reduce((sum, b) => sum + b.revenue, 0),
  avgFootfall: Math.round(branches.reduce((sum, b) => sum + b.footfall, 0) / branches.length),
  avgRating: Number((branches.reduce((sum, b) => sum + b.reviews, 0) / branches.length).toFixed(1)),
  avgEngagement: Math.round(branches.reduce((sum, b) => sum + b.engagement, 0) / branches.length)
};

export const trialExpiringBranches = branches.filter(b => b.trialDaysLeft > 0 && b.trialDaysLeft <= 15);

export const statusCounts = {
  partnered: branches.filter(b => b.status === "Partnered").length,
  inProgress: branches.filter(b => b.status === "In Progress").length,
  closed: branches.filter(b => b.status === "Closed").length,
  noStatus: branches.filter(b => b.status === "No Status").length
};