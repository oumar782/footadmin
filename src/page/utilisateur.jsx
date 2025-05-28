import React, { useState, useEffect } from 'react';
import UserList from '../composant/UserList';
import UserForm from '../composant/UserForm';
import Header from '../composant/Header';

const Utilisateur = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const initialUsers = [
      { id: 1, name: 'Pierre Dupont', email: 'pierre@example.com', role: 'admin', status: 'active' },
      { id: 2, name: 'Marie Martin', email: 'marie@example.com', role: 'user', status: 'active' },
      { id: 3, name: 'Jean Petit', email: 'jean@example.com', role: 'editor', status: 'inactive' },
      { id: 4, name: 'Sophie Bernard', email: 'sophie@example.com', role: 'user', status: 'active' },
    ];
    
    setUsers(initialUsers);
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleAddUser = () => {
    setCurrentUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur?")) {
      setUsers(users.filter(user => user.id !== userId));
      showNotification("Utilisateur supprimé avec succès", "success");
    }
  };

  const handleFormSubmit = (userData) => {
    if (currentUser) {
      setUsers(users.map(user => 
        user.id === currentUser.id ? { ...userData, id: user.id } : user
      ));
      showNotification("Utilisateur modifié avec succès", "success");
    } else {
      const newUser = {
        ...userData,
        id: Date.now(),
      };
      setUsers([...users, newUser]);
      showNotification("Utilisateur ajouté avec succès", "success");
    }
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentUser(null);
  };

  return (

    <div className="user-management">
    <Header title="Gestion des Utilisateurs" />
      
      <div className="container">
        {notification.show && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
        
        <div className="action-bars">
          <h2>Liste des Utilisateurs:</h2>
          <button className="btn-primary" onClick={handleAddUser}>
             Ajouter un utilisateur
          </button>
        </div>
        
        {showForm && (
          <UserForm 
            user={currentUser} 
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
        
        <UserList 
          users={users} 
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      </div>
    </div>
  );
};

export default Utilisateur;