import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard as DashboardIcon,
  Users as UsersIcon,
  UserCog as UserCogIcon,
  CalendarCheck as CalendarCheckIcon,
  Wallet as WalletIcon,
  BarChart3 as BarChartIcon,
  Handshake as HandshakeIcon,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
  X as CloseIcon,
  Menu as MenuIcon
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Tableau de bord');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Admin User',
    role: 'Administrateur'
  });

  useEffect(() => {
    // Récupérer les informations utilisateur depuis localStorage
    const storedName = localStorage.getItem("userNom");
    const storedRole = localStorage.getItem("userRole");
    
    if (storedName && storedRole) {
      setUserInfo({
        name: storedName,
        role: storedRole
      });
    }
  }, []);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavClick = (itemName, path) => {
    setActiveItem(itemName);
    if (path) {
      navigate(path);
    }
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen(false);
    }
  };

  useEffect(() => {
    const activeNavItem = navItems.find(item => item.path === location.pathname);
    if (activeNavItem) {
      setActiveItem(activeNavItem.name);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Gestion des utilisateurs', icon: DashboardIcon, path: '/utilisateur' },
    { name: 'Gestion des clients', icon: UserCogIcon, path: '/Gestionclient' },
    { name: 'Réservations', icon: CalendarCheckIcon, path: '/gestionreservation' },
    { name: 'Gestion des demonstrations', icon: WalletIcon, path: '/Gestiondemonstration' },
    { name: 'Partenariats', icon: HandshakeIcon, path: '/Gestionpartenariats' },
  ];

  const handleLogout = () => {
    // Supprimer les informations de localStorage
    localStorage.removeItem('userNom');
    localStorage.removeItem('userRole');
    navigate('/connexion');
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        className={`mobile-menu-button ${isScrolled ? 'scrolled' : ''}`}
        onClick={toggleMobileSidebar}
      >
        <MenuIcon size={24} />
      </button>

      {/* Desktop Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            {!isCollapsed && <span className="logo-text">FootSpace Admin</span>}
          </div>
          <button 
            className="collapse-button"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <MenuIcon size={20} /> : <CloseIcon size={20} />}
          </button>
        </div>
        
        <div className="sidebar-content">
          <div className="user-profile-container">
            <div className="user-profile">
              <img 
                className="user-avatar" 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="Admin" 
              />
              {!isCollapsed && (
                <div className="user-info">
                  <p className="user-name">{userInfo.name}</p>
                  <p className="user-role">{userInfo.role}</p>
                </div>
              )}
            </div>
          </div>
          
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  className={`nav-item ${activeItem === item.name ? 'active-nav' : ''}`}
                  onClick={() => handleNavClick(item.name, item.path)}
                >
                  <Icon size={18} className="nav-icon" />
                  {!isCollapsed && (
                    <>
                      <span>{item.name}</span>
                      {activeItem === item.name && <div className="active-indicator"></div>}
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <LogOutIcon size={18} className="logout-icon" />
            {!isCollapsed && "Déconnexion"}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-header">
          <div className="logo-container">
            <span className="logo-text">FootSpace Admin</span>
          </div>
          <button 
            className="close-sidebar-button"
            onClick={toggleMobileSidebar}
            aria-label="Close sidebar"
          >
            <CloseIcon size={24} />
          </button>
        </div>
        
        <div className="mobile-sidebar-content">
          <div className="user-profile-container">
            <div className="user-profile">
              <img 
                className="user-avatar" 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="Admin" 
              />
              <div className="user-info">
                <p className="user-name">{userInfo.name}</p>
                <p className="user-role">{userInfo.role}</p>
              </div>
            </div>
          </div>
          
          <nav className="mobile-sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  className={`nav-item ${activeItem === item.name ? 'active-nav' : ''}`}
                  onClick={() => handleNavClick(item.name, item.path)}
                >
                  <Icon size={18} className="nav-icon" />
                  <span>{item.name}</span>
                  {activeItem === item.name && <div className="active-indicator"></div>}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="mobile-sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <LogOutIcon size={18} className="logout-icon" />
            Déconnexion
          </button>
        </div>
      </div>

      <style jsx>{`
        :root {
          --primary-color:rgb(6, 68, 22);
          --primary-dark:rgb(11, 82, 3);
          --primary-light:rgb(20, 20, 21);
          --accent-color:rgb(185, 16, 22);
          --text-light: #f8fafc;
          --text-muted: #94a3b8;
          --bg-dark: #0f172a;
          --transition-speed: 0.3s;
        }

        /* Base Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        button {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        /* Desktop Sidebar */
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 250px;
          background-color: var(--primary-color);
          color: var(--text-light);
          display: flex;
          flex-direction: column;
          transition: width var(--transition-speed) ease;
          z-index: 100;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 2);
        }

        .sidebar.collapsed {
          width: 70px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid var(--primary-dark);
          height: 64px;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .logo-icon {
          color: var(--accent-color);
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .collapse-button {
          color: var(--text-light);
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .collapse-button:hover {
          opacity: 1;
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 0;
        }

        .user-profile-container {
          padding: 0 1rem 1.5rem;
        }

        .user-profile {
          display: flex;
          align-items: center;
          background-color: var(--primary-dark);
          padding: 0.75rem;
          border-radius: 0.5rem;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0 0.5rem;
        }

        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-light);
          text-decoration: none;
          border-radius: 0.5rem;
          transition: background-color 0.2s;
          text-align: left;
          width: 100%;
        }

        .nav-item:hover {
          background-color: var(--primary-dark);
        }

        .nav-item.active-nav {
          background-color: var(--primary-dark);
        }

        .active-indicator {
          position: absolute;
          right: 0.5rem;
          width: 4px;
          height: 60%;
          background-color: var(--accent-color);
          border-radius: 2px;
        }

        .sidebar.collapsed .nav-item {
          justify-content: center;
          padding: 0.75rem;
        }

        .sidebar.collapsed .nav-icon {
          margin-right: 0;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid var(--primary-dark);
        }

        .logout-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-light);
          width: 100%;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          transition: background-color 0.2s;
        }

        .logout-button:hover {
          background-color: var(--primary-dark);
        }

        /* Mobile Menu Button */
        .mobile-menu-button {
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 90;
          background-color: var(--primary-color);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .mobile-menu-button.scrolled {
          top: 0.5rem;
          background-color: rgba(30, 64, 175, 0.9);
        }

        @media (min-width: 768px) {
          .mobile-menu-button {
            display: none;
          }
        }

        /* Mobile Sidebar */
        .mobile-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 250px;
          background-color: var(--primary-color);
          color: var(--text-light);
          display: flex;
          flex-direction: column;
          z-index: 100;
          transform: translateX(-100%);
          transition: transform var(--transition-speed) ease;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        }

        .mobile-sidebar.open {
          transform: translateX(0);
        }

        .mobile-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid var(--primary-dark);
          height: 64px;
        }

        .close-sidebar-button {
          color: var(--text-light);
        }

        .mobile-sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 0;
        }

        .mobile-sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0 0.5rem;
        }

        .mobile-sidebar-footer {
          padding: 1rem;
          border-top: 1px solid var(--primary-dark);
        }
      `}</style>
    </>
  );
};

export default Sidebar;