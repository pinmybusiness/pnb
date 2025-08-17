// components/IconMapper.jsx
"use client";
import { 
  Building2, 
  Store, 
  Users, 
  BarChart3, 
  Home, 
  MapPin, 
  Settings, 
  Menu, 
  X, 
  UserCircle 
} from "lucide-react";

const IconMapper = ({ iconName, className = "w-5 h-5", ...props }) => {
  const iconComponents = {
    Building2: <Building2 className={className} {...props} />,
    Store: <Store className={className} {...props} />,
    Users: <Users className={className} {...props} />,
    BarChart3: <BarChart3 className={className} {...props} />,
    Home: <Home className={className} {...props} />,
    MapPin: <MapPin className={className} {...props} />,
    Settings: <Settings className={className} {...props} />,
    Menu: <Menu className={className} {...props} />,
    X: <X className={className} {...props} />,
    UserCircle: <UserCircle className={className} {...props} />
  };

  return iconComponents[iconName] || null;
};

export default IconMapper;