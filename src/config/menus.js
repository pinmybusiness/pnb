// config/menus.js
import { 
  Store, Users, BarChart3, MapPin, Settings, 
  FileBarChart, LayoutDashboard, GraduationCap, 
  ClipboardList,
  FileCheck,
  PhoneCall
} from "lucide-react";

// ✅ Single menu list, roles are defined as numeric arrays
export const allMenus = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: [0,1,2,3,4,6,7] },
  { name: "Restaurants", href: "/dashboard/restaurants", icon: Store, roles: [0,1,2] },
  { 
    name: "Branches", 
    icon: MapPin, 
    roles: [0,2,3], 
    children: [
      { name: "Add Branch", href: "/dashboard/branches/add" },
      { name: "List Branches", href: "/dashboard/branches" },
    ]
  },
  { name: "Teams", href: "/dashboard/teams", icon: Users, roles: [0,3] },
  { name: "Leads", href: "/dashboard/leads", icon: BarChart3, roles: [1] },
  { name: "Customers", href: "/dashboard/customers", icon: Users, roles: [1] },
  { name: "Orders", href: "/dashboard/orders", icon: BarChart3, roles: [4] },
  
  { 
    name: "Trackly", 
    icon: PhoneCall, 
    roles: [6,7,8], 
    children: [
      { name: "MissedCalls", href: "/dashboard/tracking/missed-calls", roles: [6,7,8] },
      { name: "Calls History", href: "/dashboard/tracking", roles: [6,7,8] },
    ]
  },
  { 
    name: "WaitPro", 
    icon: ClipboardList, 
    roles: [6,7,8], 
    children: [
      { name: "Entry", href: "/dashboard/entry", roles: [6,7,8] },
      { name: "Waiting List", href: "/dashboard/waiting-list", roles: [6,7,8] },
      { name: "Analytics", href: "/dashboard/analytics", roles: [6,7] },
    ]
  },
  { 
    name: "Opportunities", 
    icon: GraduationCap, 
    roles: [0,1,2,6,7], 
    children: [
      { name: "Opportunities", href: "/dashboard/opportunities", roles: [0,1,2,6,7] },
      { name: "Add opportunities", href: "/dashboard/opportunities/add", roles: [6,7] },
    ]
  },
  { name: "Applications", href: "/dashboard/applications", icon: FileCheck, roles: [0,1,2] },
  { name: "Contacts", href: "/dashboard/contacts", icon: Users, roles: [0] },
  { name: "Reports", href: "/dashboard/reports", icon: FileBarChart, roles: [0] },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, roles: [0,3] },
];

// ✅ Panel titles/subtitles based on role number
export const panelInfo = {
  0: { title: "FasterQ", subtitle: "Company Admin" },
  1: { title: "CRM System", subtitle: "Sales Dashboard" },
  2: { title: "Company Team", subtitle: "Team Dashboard" },
  3: { title: "Restaurant Hub", subtitle: "Admin Portal" },
  4: { title: "Manager Console", subtitle: "Operations Dashboard" },
  5: { title: "Restaurant Team", subtitle: "Team Dashboard" },
  6: { title: "Branch Manager", subtitle: "Operations Dashboard" },
  7: { title: "Branch Team", subtitle: "Operations Dashboard" },
  8: { title: "Branch Staff", subtitle: "Staff Dashboard" },
};
