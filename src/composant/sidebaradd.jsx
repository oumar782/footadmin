import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Handshake, 
  Target, 
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import footLogos from '../assets/footsolutions.png';
import './side.css';
const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Gestion des utilisateurs", url: "/utilisateur", icon: BarChart3 },
  { title: "Suivi des Clients", url: "/suiviclient", icon: Users },
  { title: "Suivi des Réservations", url: "/suivireservation", icon: Calendar },
  { title: "Suivi des Partenariats", url: "/suivipartenariats", icon: Handshake },
  { title: "Suivi des Démonstrations", url: "/suividemonstration", icon: Target },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    setIsLoggingOut(true);
    // Simulation d'une déconnexion asynchrone
    setTimeout(() => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      navigate('/connexion');
    }, 800);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
  
          {!isCollapsed && <span className="logo-text">FootSolutions Admin</span>}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="sidebar-content">
        <div className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                className={`menu-item ${isActive(item.url) ? 'active' : ''}`}
                onClick={() => navigate(item.url)}
              >
                <div className="menu-icon">
                  <Icon size={18} />
                </div>
                {!isCollapsed && <span>{item.title}</span>}
                {!isCollapsed && isActive(item.url) && (
                  <div className="active-indicator"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="sidebar-footer">
        <button 
          className={`logout-btn ${isLoggingOut ? 'logging-out' : ''}`}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <div className="logout-icon">
            <LogOut size={18} />
          </div>
          {!isCollapsed && (
            <span>{isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>
          )}
        </button>
      </div>

    </div>
  );
};

export default AppSidebar;