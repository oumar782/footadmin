import React from 'react';
import './UserCard.css';

const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <div className="user-card">
      <div className="user-avatar">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div className="user-details">
        <h3>{user.name}</h3>
        <p className="user-email">{user.email}</p>
        <div className="user-status">
          <span className={`status-indicator ${user.status}`}></span>
          {user.status === 'active' ? 'Actif' : 'Inactif'}
        </div>
        <p className={`user-role ${user.role}`}>{
          user.role === 'admin' ? 'Administrateur' : 
          user.role === 'editor' ? 'Éditeur' : 'Utilisateur'
        }</p>
      </div>
      <div className="user-actions">
        <button 
          className="btn-edit" 
          onClick={onEdit} 
          aria-label="Modifier"
        >
          Modifier
        </button>
        <button 
          className="btn-delete" 
          onClick={onDelete}
          aria-label="Supprimer"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default UserCard;
