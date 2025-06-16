import React from 'react';
import './UserCard.css';

const UserCard = ({ user, onEdit, onDelete }) => {
  // Statut utilisateur plus clair
  const statutLabel = {
    actif: 'Actif',
    inactif: 'Inactif',
    suspendu: 'Suspendu'
  };

  // Rôle utilisateur plus lisible
  const roleLabel = {
    Administrateur: 'Administrateur',
    Gestionnaire: 'Gestionnaire'
    
  };

  return (
    <div className="user-card">
      <div className="user-avatar">
        {user.nom.charAt(0).toUpperCase()}
      </div>

      <div className="user-details">
        <h3>{user.nom}</h3>
        <p className="user-email">{user.email}</p>

        <div className={`user-status ${user.statut}`}>
          <span className={`status-indicator ${user.statut}`}></span>
          {statutLabel[user.statut] || 'Inconnu'}
        </div>

        <p className={`user-role ${user.role}`}>
          {roleLabel[user.role] || user.role}
        </p>
      </div>

      <div className="user-actions">
        <button 
          className="btn-edit" 
          onClick={onEdit} 
          aria-label="Modifier l'utilisateur"
        >
          ✏️ Modifier
        </button>

        <button 
          className="btn-delete" 
          onClick={onDelete}
          aria-label="Supprimer l'utilisateur"
        >
          🗑️ Supprimer
        </button>
      </div>
    </div>
  );
};

export default UserCard;
