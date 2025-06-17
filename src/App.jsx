import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
  {/* interface de connexion */}
import ConnexionPage from './page/Authentification';
  {/* composant de l interface  gestionnaire */}

import Sidebar from './composant/Sidebar';
import Header from './composant/Header';
import Bienvenue from './composant/bienvenue';
import User from './page/utilisateur';
import Clients from './page/Gestionclient';
import Reservation from './page/GestionReservation';
import Partenaires from './page/Gestionpartenariats';
import Demonstrations from './page/Demonstration';
  {/* composant de l interface  Administrateur */}
import Sideadmin from './composant/sidebaradd';
import Administrateur from './page/Administrateur';
import Dashboard from './page/Dashboard';
import Suiviclient from './page/suiviclient';



  {/* Layout gestionnaire */}

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

  {/* Layout Administrateur */}
const MainLayoutadmin = () => {
  return (
    <div className="app">
      <Sideadmin />
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

  {/* interface gestionnaire*/}    
      <Route element={<MainLayout />}>
        <Route path="/bienvenues" element={<Bienvenue />} />
        <Route path="/Gestionclient" element={<Clients />} />
        <Route path="/Gestionreservation" element={<Reservation />} />
        <Route path="/Gestionpartenariats" element={<Partenaires />} />
        <Route path="/Gestiondemonstration" element={<Demonstrations />} />
      </Route>
  {/* interface Administrateur*/}    
         <Route element={<MainLayoutadmin />}>
             <Route path="/Administrateur" element={<Administrateur />} />
             <Route path="/utilisateur" element={<User />} />
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/suiviclient" element={<Suiviclient />} />


          </Route>
     
    </Routes>
  );
}

export default App;