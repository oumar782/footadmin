import React, { useState } from 'react';
import UserCard from '../composant/UserCard';
import './UserList.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Tu dois avoir <ToastContainer /> dans ton App.js pour que les toasts s'affichent.

const UserList = ({ users, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (userId) => {
    if (!window.confirm("Es-tu sûr de vouloir supprimer cet utilisateur ?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la suppression');
      }

      toast.success("Utilisateur supprimé avec succès !");
      onDelete(userId); // Mets à jour la liste côté parent
    } catch (error) {
      console.error('Erreur suppression :', error);
      toast.error("Échec de la suppression de l'utilisateur.");
    }
  };

  return (
    <div className="user-list">
      <div className="search-container">
        <label htmlFor="user-search">Recherche d'utilisateur :</label>
        <input
          type="text"
          id="user-search"
          placeholder="Rechercher par nom ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p className="no-results">Aucun utilisateur trouvé</p>
      ) : (
        <div className="user-grid">
          {filteredUsers.map(user => (
            <UserCard
              key={user.id_utilisateur}
              user={user}
              onEdit={() => onEdit(user)}
              onDelete={() => handleDelete(user.id_utilisateur)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
