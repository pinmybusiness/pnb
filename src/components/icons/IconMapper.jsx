// components/icons/IconMapper.jsx
import { 
  Home,
  Store,
  MapPin,
  Users,
  BarChart3,
  Settings,
  Building2,
  // Add all other icons you need
} from "lucide-react";

const IconMapper = ({ iconName, ...props }) => {
  const icons = {
    Home: <Home {...props} />,
    Store: <Store {...props} />,
    MapPin: <MapPin {...props} />,
    Users: <Users {...props} />,
    BarChart3: <BarChart3 {...props} />,
    Settings: <Settings {...props} />,
    Building2: <Building2 {...props} />,
    // Add mappings for all other icons
  };

  return icons[iconName] || null;
};

export default IconMapper;