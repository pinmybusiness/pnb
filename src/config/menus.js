// config/menus.js
import { 
  Store, Users, BarChart3, MapPin, Settings, 
  FileBarChart, LayoutDashboard, GraduationCap, 
  ClipboardList,
  PhoneCall,
  Building2,
  Package,
  CreditCard,
  Wrench,
  AudioLines,
  Clock,
  UsersRound,
  TrendingUp,
  Cable
} from "lucide-react";

// ✅ Single menu list, roles are defined as numeric arrays
export const allMenus = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: [0,1,2,3,4,6,7,8] },
  { name: "Organizations", href: "/dashboard/organizations", icon: Building2, roles: [0,1,2] },
  { name: "Branches", href: "/dashboard/branches", icon: MapPin, roles: [0,1,2] },
  // { 
  //   name: "Branches", 
  //   icon: MapPin, 
  //   roles: [0,2,3], 
  //   children: [
  //     { name: "Add Branch", href: "/dashboard/branches/add" },
  //     { name: "List Branches", href: "/dashboard/branches" },
  //   ]
  // },
  { name: "Leads", href: "/dashboard/leads", icon: BarChart3, roles: [1] },
  { name: "Customers", href: "/dashboard/customers", icon: Users, roles: [1] },
  { name: "Orders", href: "/dashboard/orders", icon: BarChart3, roles: [4] },
  

  { name: "FollowUp Calls", href: "/dashboard/trackly/followup-calls", icon: PhoneCall, roles: [6,7] },
  { name: "Calls History", href: "/dashboard/trackly", icon: Clock, roles: [6,7] },
  { name: "Team Performance", href: "/dashboard/trackly/team-performance", icon: TrendingUp, roles: [6,7] },
  { name: "Customer Intelligence", href: "/dashboard/trackly/customer-intelligence", icon: UsersRound, roles: [6,7] },
  { name: "Integrations", href: "/dashboard/integrations", icon: Cable, roles: [6] },

  { name: "Teams", href: "/dashboard/teams", icon: Users, roles: [0,3,6] },
  { name: "Services", href: "/dashboard/services", icon: Wrench, roles: [0] },
  { name: "Subscriptions", href: "/dashboard/service-subscriptions", icon: CreditCard, roles: [0] },
  // { name: "Services", href: "/dashboard/services", icon: Package, roles: [6] },

  // { name: "Applications", href: "/dashboard/applications", icon: FileCheck, roles: [0,1,2] },
  { name: "Contacts", href: "/dashboard/contacts", icon: Users, roles: [0,1,2] },
  { name: "Recordings", href: "/dashboard/trackly/recordings", icon: AudioLines, roles: [0,1] },
  // { name: "Payload", href: "/dashboard/payload-list", icon: Users, roles: [0,1] },
  // { name: "Reports", href: "/dashboard/reports", icon: FileBarChart, roles: [0] },
  // { name: "Settings", href: "/dashboard/settings", icon: Settings, roles: [0,3] },
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
