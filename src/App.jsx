import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Sidebar from './composant/Sidebar';
import Header from './composant/Header';
import Bienvenue from './composant/bienvenue';
import User from './page/utilisateur';
import Clients from './page/Gestionclient';
import './App.css';
import Reservation from './page/GestionReservation';
import Partenaires from './page/Gestionpartenariats';
import Demonstrations from './page/Demonstration';
import ConnexionPage from './page/Authentification'
const MainLayout = () => {
  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Routes>
       <Route path="/" element={<Navigate to="/connexion" replace />} />
  
  {/* Route de connexion avec son composant */}
  <Route path="/connexion" element={<ConnexionPage />} />
      
      <Route element={<MainLayout />}>
        <Route path="/bienvenues" element={<Bienvenue />} />
        <Route path="/utilisateur" element={<User />} />
        <Route path="/Gestionclient" element={<Clients />} />
        <Route path="/Gestionreservation" element={<Reservation />} />
        <Route path="/Gestionpartenariats" element={<Partenaires />} />
        <Route path="/Gestiondemonstration" element={<Demonstrations />} />
      </Route>
    </Routes>
  );
}

export default App;