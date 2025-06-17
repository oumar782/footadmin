import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Handshake, 
  Target, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import "./side.css";

const menuItems = [
  { title: "Gestion des utilisateurs", url: "/utilisateur", icon: BarChart3 },

  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: " suivi des Clients", url: "/suiviclient", icon: Users },
  { title: " Suivi des Réservations", url: "/reservations", icon: Calendar },
  { title: " Suivi des Partenariats", url: "/partenariats", icon: Handshake },
  { title: "Suivi des  Démonstrations", url: "/demonstrations", icon: Target },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            ⚽
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg text-gray-900">Foot Admin Suite</span>
          )}
        </div>
      </div>

      <div className="sidebar-content">
        <div className="sidebar-group">
          <div className="sidebar-group-label px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
            Navigation
          </div>
          <div className="sidebar-group-content">
            <ul className="sidebar-menu">
              {menuItems.map((item) => (
                <li key={item.title} className="sidebar-menu-item">
                  <button
                    onClick={() => navigate(item.url)}
                    className={`sidebar-menu-button w-full flex items-center gap-3 px-4 py-2 text-sm ${
                      isActive(item.url) ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;