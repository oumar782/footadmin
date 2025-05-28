// Header.js
import React from 'react';
import '../gestion/headeruser.css';


const Header = ({ title }) => {
  return (
    <header className="app-headerss">
      <div className="containerupyy">
        <div className="app-header-content">
          <div className="app-logo" role="img" aria-label="Users icon">👥</div>
          <h1>{title}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;