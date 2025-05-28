import React, { useState, useEffect } from 'react';
import "./Header.css";

const Header = () => {
  const [time, setTime] = useState(new Date());
  const [userInfo, setUserInfo] = useState({
    name: '',
    role: ''
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

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(time);

  return (
    <header className="app-headercont">
      <div className="app-header-containerss">
        <div className="app-header-titlese">
          <button id="open-sidebar" className="app-header-menu-button">
            ☰
          </button>
          <h1 className="app-header-heading">
            Foot Admin suite - {userInfo.name || "Invité"} ({userInfo.role || "Non connecté"})
          </h1>
        </div>

        <div className="app-header-right-section">
          <div className="app-header-time-info">
            <span className="app-header-time">{formattedTime}</span>
            <span className="app-header-date">{formattedDate}</span>
          </div>

          <div className="app-header-notifications">
            <button className="app-header-notification-button">
              <i className="fas fa-bell"></i>
              <span className="app-header-notification-dot app-header-notification-dot--red"></span>
            </button>
            <button className="app-header-notification-button">
              <i className="fas fa-envelope"></i>
              <span className="app-header-notification-dot app-header-notification-dot--blue"></span>
            </button>
          </div>

          <div className="app-header-user">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Utilisateur"
              className="app-header-user-avatar"
            />
            <div className="app-header-user-info">
              <span className="app-header-user-name">{userInfo.name || 'Utilisateur'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;