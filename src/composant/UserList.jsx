import React, { useState } from 'react';
import UserCard from '../composant/UserCard';
import './UserList.css';

const UserList = ({ users, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-list">
  <div className="search-container">
  <label htmlFor="user-search">Recherche d'utilisateur :</label>
  <input 
    type="text" 
    id="user-search"
    placeholder="Rechercher par nom..."
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
              key={user.id} 
              user={user} 
              onEdit={() => onEdit(user)}
              onDelete={() => onDelete(user.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
