import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Header avec bouton d'action */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button 
          className="new-reservation-btn" 
          onClick={() => navigate('/reservations')}
        >
          + Nouvelle réservation
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">👥</div>
          </div>
          <div className="stat-value">1,247</div>
          <div className="stat-label">Clients actifs</div>
          <div className="stat-change positive">
            ↗️ +12% ce mois
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon">📅</div>
          </div>
          <div className="stat-value">3,892</div>
          <div className="stat-label">Réservations</div>
          <div className="stat-change positive">
            ↗️ +8% ce mois
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon">💰</div>
          </div>
          <div className="stat-value">€24,750</div>
          <div className="stat-label">Revenus mensuels</div>
          <div className="stat-change positive">
            ↗️ +15% ce mois
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-header">
            <div className="stat-icon">📊</div>
          </div>
          <div className="stat-value">87%</div>
          <div className="stat-label">Taux d'occupation</div>
          <div className="stat-change negative">
            ↘️ -3% ce mois
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-content-grid">
        {/* Chart */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Évolution des réservations</h3>
            <p>Tendance sur les 6 derniers mois</p>
          </div>
          <div className="chart-placeholder">
            📈 Graphique des réservations par mois
          </div>
        </div>

        {/* Activity Feed */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Activité récente</h3>
            <p>Dernières actions sur la plateforme</p>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📅</div>
              <div className="activity-content">
                <div className="activity-title">Nouvelle réservation</div>
                <div className="activity-description">
                  Martin Dubois - Terrain A, 14h-16h
                </div>
              </div>
              <div className="activity-time">Il y a 5 min</div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">👥</div>
              <div className="activity-content">
                <div className="activity-title">Nouveau client</div>
                <div className="activity-description">
                  Sophie Martin s'est inscrite
                </div>
              </div>
              <div className="activity-time">Il y a 12 min</div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">💰</div>
              <div className="activity-content">
                <div className="activity-title">Paiement reçu</div>
                <div className="activity-description">
                  €45 - Réservation #1284
                </div>
              </div>
              <div className="activity-time">Il y a 18 min</div>
            </div>
          </div>
        </div>
      </div>

      {/* Prévisions Section */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3>Prévisions de la semaine</h3>
          <p>Analyse prédictive basée sur l'historique</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">156</div>
            <div className="stat-label">Réservations prévues</div>
            <div className="stat-change">↗️ +5% vs semaine dernière</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">€3,890</div>
            <div className="stat-label">Revenus estimés</div>
            <div className="stat-change">↗️ +8% vs semaine dernière</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">92%</div>
            <div className="stat-label">Taux d'occupation prévu</div>
            <div className="stat-change">↗️ Très forte demande</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;