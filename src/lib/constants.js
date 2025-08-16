// lib/constants.js
export const ROLE_MAPPING = {
  0: 'companyAdmin',
  1: 'companyCRM',
  2: 'companyTeam',
  3: 'restaurantAdmin',
  4: 'restaurantBranch',
  5: 'restaurantTeam'
};

export const DASHBOARD_CONFIG = {
  companyAdmin: {
    title: "Wait Pro",
    subtitle: "Company Admin",
    menus: [
      { name: "Dashboard", href: "/company/admin", icon: "Home" },
      { name: "Restaurants", href: "/company/admin/restaurants", icon: "Store" },
      { name: "Branches", href: "/company/admin/branches", icon: "MapPin" },
      { name: "Teams", href: "/company/admin/teams", icon: "Users" },
      { name: "Reports", href: "/company/admin/reports", icon: "BarChart3" },
      { name: "Settings", href: "/company/admin/settings", icon: "Settings" }
    ]
  },
    companyCRM: {
        title: "CRM System",
        subtitle: "Sales Dashboard",
        menus: [
        { name: "Dashboard", href: "/company/crm", icon: Building2 },
        { name: "Leads", href: "/company/crm/leads", icon: BarChart3 },
        { name: "Customers", href: "/company/crm/customers", icon: Users },
        ]
    },
  restaurantAdmin: {
    title: "Restaurant Hub",
    subtitle: "Admin Portal",
    menus: [
      { name: "Dashboard", href: "/restaurant/admin", icon: "Building2" },
      { name: "Branches", href: "/restaurant/admin/branches", icon: "Store" },
      { name: "Teams", href: "/restaurant/admin/teams", icon: "Users" },
      { name: "Reports", href: "/restaurant/admin/reports", icon: "BarChart3" },
      { name: "Settings", href: "/restaurant/admin/settings", icon: "Settings" }
    ]
  },
   restaurantManager: {
      title: "Manager Console",
      subtitle: "Operations Dashboard",
      menus: [
        { name: "Dashboard", href: "/restaurant/manager", icon: Building2 },
        { name: "Orders", href: "/restaurant/manager/orders", icon: BarChart3 },
        { name: "Reports", href: "/restaurant/manager/reports", icon: Users },
      ]
    },
  // Add other role configurations
};