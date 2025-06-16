import React, { useState, useEffect } from 'react';
import UserList from '../composant/UserList';
import UserForm from '../composant/UserForm';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Utilisateur.css';

const Utilisateur = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/ajoutuser/');
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.data);
      } else {
        throw new Error(data.message || 'Erreur lors de la récupération des utilisateurs');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    setCurrentUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/ajoutuser/${userId}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setUsers(users.filter(user => user.id_utilisateur !== userId));
          toast.success('Utilisateur supprimé avec succès');
        } else {
          throw new Error(data.message || 'Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast.error(error.message || 'Une erreur est survenue');
      }
    }
  };

  const handleFormSubmit = (userData) => {
    if (currentUser) {
      // Mise à jour de l'utilisateur
      setUsers(users.map(user => 
        user.id_utilisateur === currentUser.id_utilisateur ? userData : user
      ));
      toast.success('Utilisateur mis à jour avec succès');
    } else {
      // Ajout d'un nouvel utilisateur
      setUsers([userData, ...users]);
      toast.success('Utilisateur ajouté avec succès');
    }
    setShowForm(false);
  };

  return (
    <div className="user-management-container">
      <div className="user-management-content">
        
        <div className="user-management-card">
          <div className="action-bar">
            <h2>Liste des Utilisateurs</h2>
            <button className="btn-primary" onClick={handleAddUser}>
              Ajouter un utilisateur
            </button>
          </div>
          
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Chargement en cours...</p>
            </div>
          ) : (
            <>
              {showForm && (
                <UserForm 
                  user={currentUser} 
                  onSubmit={handleFormSubmit}
                  onCancel={() => setShowForm(false)}
                />
              )}
              
              <UserList 
                users={users} 
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Utilisateur;