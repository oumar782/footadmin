import React, { useState, useEffect } from 'react';
import { FaPlus, FaEye, FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import './GestionClient.css';

const GestionClients = () => {
  // State principal
  const [clientsList, setClientsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentClientsPage, setCurrentClientsPage] = useState(1);
  const [totalClientsPages, setTotalClientsPages] = useState(1);
  const [searchClientsTerm, setSearchClientsTerm] = useState('');
  const [clientsFilter, setClientsFilter] = useState('all');
  const [clientsSort, setClientsSort] = useState('nom_client-asc');

  // Modals et états associés
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showViewClientModal, setShowViewClientModal] = useState(false);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [showDeleteClientModal, setShowDeleteClientModal] = useState(false);
  const [selectedClientData, setSelectedClientData] = useState(null);

  // Formulaires
  const [newClientData, setNewClientData] = useState({
    nom_client: '',
    prenom: '',
    email: '',
    statut: 'active'
  });

  const [editClientData, setEditClientData] = useState({
    id_client: '',
    nom_client: '',
    prenom: '',
    email: '',
    statut: 'active'
  });

  // Toast
  const [clientToast, setClientToast] = useState(null);

  // Constantes
  const CLIENTS_PER_PAGE = 5;

  // Récupérer les clients depuis l'API
  const fetchClientsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/client/?search=${searchClientsTerm}&statut=${clientsFilter}&sort=${clientsSort}&page=${currentClientsPage}&limit=${CLIENTS_PER_PAGE}`
      );
      const data = await response.json();
      if (data.success) {
        setClientsList(data.data);
        setTotalClientsPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Erreur:', error);
      showClientToast('Erreur lors du chargement des clients', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientsData();
  }, [searchClientsTerm, clientsFilter, clientsSort, currentClientsPage]);

  // Gestion des actions CRUD
  const handleAddNewClient = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/client/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClientData)
      });
      const data = await response.json();
      if (data.success) {
        setNewClientData({
          nom_client: '',
          prenom: '',
          email: '',
          statut: 'active'
        });
        setShowAddClientModal(false);
        showClientToast('Client ajouté avec succès', 'success');
        fetchClientsData();
      } else {
        showClientToast(data.message || 'Erreur lors de l\'ajout', 'error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showClientToast('Erreur lors de l\'ajout du client', 'error');
    }
  };

  const handleEditCurrentClient = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/client/${editClientData.id_client}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editClientData)
      });
      const data = await response.json();
      if (data.success) {
        setShowEditClientModal(false);
        showClientToast('Client modifié avec succès', 'success');
        fetchClientsData();
      } else {
        showClientToast(data.message || 'Erreur lors de la modification', 'error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showClientToast('Erreur lors de la modification du client', 'error');
    }
  };

  const handleDeleteSelectedClient = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/client/${selectedClientData.id_client}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setShowDeleteClientModal(false);
        showClientToast('Client supprimé avec succès', 'success');
        if (clientsList.length === 1 && currentClientsPage > 1) {
          setCurrentClientsPage(currentClientsPage - 1);
        } else {
          fetchClientsData();
        }
      } else {
        showClientToast(data.message || 'Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showClientToast('Erreur lors de la suppression du client', 'error');
    }
  };

  // Utilitaires
  const showClientToast = (message, type = 'info') => {
    setClientToast({ message, type });
    setTimeout(() => setClientToast(null), 3000);
  };

  const getClientFullName = (client) => {
    return `${client.nom_client} ${client.prenom}`;
  };

  const getClientInitials = (client) => {
    return `${client.nom_client[0]}${client.prenom[0]}`.toUpperCase();
  };

  // Render
  return (
    <div className="clients-management-container">
      <div className="clients-table-wrapper">
        {/* Header */}
        <div className="clients-header-section">
          <h1>Gestion des Clients</h1>
          <button 
            className="clients-add-btn clients-primary-btn"
            onClick={() => setShowAddClientModal(true)}
          >
            <FaPlus /> Ajouter Client
          </button>
        </div>

        {/* Filtres et recherche */}
        <div className="clients-toolbar-section">
          <div className="clients-search-container">
            <FaSearch className="clients-search-icon" />
            <input
              type="text"
              className="clients-search-input"
              placeholder="Rechercher..."
              value={searchClientsTerm}
              onChange={(e) => setSearchClientsTerm(e.target.value)}
            />
            {searchClientsTerm && (
              <button 
                className="clients-clear-search"
                onClick={() => setSearchClientsTerm('')}
              >
                <FaTimes />
              </button>
            )}
          </div>
          <div className="clients-filters-container">
            <select 
              className="clients-filter-select"
              value={clientsSort}
              onChange={(e) => setClientsSort(e.target.value)}
            >
              <option value="nom_client-asc">Trier par nom (A-Z)</option>
              <option value="nom_client-desc">Trier par nom (Z-A)</option>
              <option value="created_at-desc">Date récente</option>
              <option value="created_at-asc">Date ancienne</option>
            </select>
            <select 
              className="clients-filter-select"
              value={clientsFilter}
              onChange={(e) => setClientsFilter(e.target.value)}
            >
              <option value="all">Tous les clients</option>
              <option value="active">Clients actifs</option>
              <option value="inactive">Clients inactifs</option>
            </select>
          </div>
        </div>

        {/* Tableau des clients */}
        <div className="clients-table-responsive">
          <table className="clients-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="clients-loading-message">Chargement en cours...</td>
                </tr>
              ) : clientsList.length > 0 ? (
                clientsList.map(client => (
                  <tr key={client.id_client}>
                    <td>{client.id_client}</td>
                    <td>{client.nom_client}</td>
                    <td>{client.prenom}</td>
                    <td>{client.email}</td>
                    <td>
                      <span className={`clients-status-badge ${client.statut === 'active' ? 'clients-active-badge' : 'clients-inactive-badge'}`}>
                        {client.statut === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td>
                      <div className="clients-actions-group">
                        <button 
                          className="clients-action-btn clients-view-btn"
                          onClick={() => {
                            setSelectedClientData(client);
                            setShowViewClientModal(true);
                          }}
                          title="Voir détails"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="clients-action-btn clients-edit-btn"
                          onClick={() => {
                            setEditClientData({ ...client });
                            setShowEditClientModal(true);
                          }}
                          title="Modifier"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="clients-action-btn clients-delete-btn"
                          onClick={() => {
                            setSelectedClientData(client);
                            setShowDeleteClientModal(true);
                          }}
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="clients-no-data">Aucun client trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="clients-pagination-section">
          <button 
            className="clients-pagination-btn"
            onClick={() => setCurrentClientsPage(prev => Math.max(prev - 1, 1))}
            disabled={currentClientsPage === 1}
          >
            <FaChevronLeft />
          </button>
          <span>Page {currentClientsPage} sur {totalClientsPages}</span>
          <button 
            className="clients-pagination-btn"
            onClick={() => setCurrentClientsPage(prev => prev + 1)}
            disabled={currentClientsPage === totalClientsPages || clientsList.length < CLIENTS_PER_PAGE}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Modal Ajout Client */}
      {showAddClientModal && (
        <div className="clients-modal-overlay">
          <div className="clients-add-modal">
            <div className="clients-modal-header">
              <h3>Ajouter un Client</h3>
              <button className="clients-close-btn" onClick={() => setShowAddClientModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="clients-modal-body">
              <div className="clients-form-group">
                <label>Nom</label>
                <input
                  type="text"
                  value={newClientData.nom_client}
                  onChange={(e) => setNewClientData({...newClientData, nom_client: e.target.value})}
                  required
                />
              </div>
              <div className="clients-form-group">
                <label>Prénom</label>
                <input
                  type="text"
                  value={newClientData.prenom}
                  onChange={(e) => setNewClientData({...newClientData, prenom: e.target.value})}
                  required
                />
              </div>
              <div className="clients-form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newClientData.email}
                  onChange={(e) => setNewClientData({...newClientData, email: e.target.value})}
                  required
                />
              </div>
              <div className="clients-form-group">
                <label>Statut</label>
                <select
                  value={newClientData.statut}
                  onChange={(e) => setNewClientData({...newClientData, statut: e.target.value})}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>
            <div className="clients-modal-footer">
              <button 
                className="clients-secondary-btn"
                onClick={() => setShowAddClientModal(false)}
              >
                Annuler
              </button>
              <button 
                className="clients-primary-btn"
                onClick={handleAddNewClient}
                disabled={!newClientData.nom_client || !newClientData.prenom || !newClientData.email}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Visualisation Client */}
      {showViewClientModal && selectedClientData && (
        <div className="clients-modal-overlay">
          <div className="clients-view-modal">
            <div className="clients-modal-header">
              <h3>Détails du Client</h3>
              <button className="clients-close-btn" onClick={() => setShowViewClientModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="clients-modal-body">
              <div className="clients-detail-header">
                <div className="clients-avatar">
                  {getClientInitials(selectedClientData)}
                </div>
                <div className="clients-detail-info">
                  <h2>{getClientFullName(selectedClientData)}</h2>
                  <span className={`clients-status-badge ${selectedClientData.statut === 'active' ? 'clients-active-badge' : 'clients-inactive-badge'}`}>
                    {selectedClientData.statut === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
              <div className="clients-detail-item">
                <div className="clients-detail-label">ID</div>
                <div className="clients-detail-value">{selectedClientData.id_client}</div>
              </div>
              <div className="clients-detail-item">
                <div className="clients-detail-label">Nom</div>
                <div className="clients-detail-value">{selectedClientData.nom_client}</div>
              </div>
              <div className="clients-detail-item">
                <div className="clients-detail-label">Prénom</div>
                <div className="clients-detail-value">{selectedClientData.prenom}</div>
              </div>
              <div className="clients-detail-item">
                <div className="clients-detail-label">Email</div>
                <div className="clients-detail-value">{selectedClientData.email}</div>
              </div>
              <div className="clients-detail-item">
                <div className="clients-detail-label">Statut</div>
                <div className="clients-detail-value">
                  {selectedClientData.statut === 'active' ? 'Actif' : 'Inactif'}
                </div>
              </div>
            </div>
            <div className="clients-modal-footer">
              <button 
                className="clients-primary-btn"
                onClick={() => setShowViewClientModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modification Client */}
      {showEditClientModal && (
        <div className="clients-modal-overlay">
          <div className="clients-edit-modal">
            <div className="clients-modal-header">
              <h3>Modifier le Client</h3>
              <button className="clients-close-btn" onClick={() => setShowEditClientModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="clients-modal-body">
              <div className="clients-form-group">
                <label>Nom</label>
                <input
                  type="text"
                  value={editClientData.nom_client}
                  onChange={(e) => setEditClientData({...editClientData, nom_client: e.target.value})}
                  required
                />
              </div>
              <div className="clients-form-group">
                <label>Prénom</label>
                <input
                  type="text"
                  value={editClientData.prenom}
                  onChange={(e) => setEditClientData({...editClientData, prenom: e.target.value})}
                  required
                />
              </div>
              <div className="clients-form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editClientData.email}
                  onChange={(e) => setEditClientData({...editClientData, email: e.target.value})}
                  required
                />
              </div>
              <div className="clients-form-group">
                <label>Statut</label>
                <select
                  value={editClientData.statut}
                  onChange={(e) => setEditClientData({...editClientData, statut: e.target.value})}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>
            <div className="clients-modal-footer">
              <button 
                className="clients-secondary-btn"
                onClick={() => setShowEditClientModal(false)}
              >
                Annuler
              </button>
              <button 
                className="clients-primary-btn"
                onClick={handleEditCurrentClient}
                disabled={!editClientData.nom_client || !editClientData.prenom || !editClientData.email}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmation Suppression */}
      {showDeleteClientModal && selectedClientData && (
        <div className="clients-modal-overlay">
          <div className="clients-delete-modal">
            <div className="clients-modal-header">
              <h3>Confirmer la suppression</h3>
              <button className="clients-close-btn" onClick={() => setShowDeleteClientModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="clients-delete-modal-body">
              <div className="clients-warning-container">
                <div className="clients-warning-icon">
                  <FaTrash />
                </div>
                <p>Êtes-vous sûr de vouloir supprimer le client <strong>{getClientFullName(selectedClientData)}</strong> ?</p>
              </div>
              <p className="clients-warning-text">
                Cette action est irréversible et supprimera toutes les données associées à ce client.
              </p>
            </div>
            <div className="clients-modal-footer">
              <button 
                className="clients-secondary-btn"
                onClick={() => setShowDeleteClientModal(false)}
              >
                Annuler
              </button>
              <button 
                className="clients-danger-btn"
                onClick={handleDeleteSelectedClient}
              >
                <FaTrash /> Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {clientToast && (
        <div className={`clients-toast clients-toast-${clientToast.type}`}>
          {clientToast.message}
        </div>
      )}
    </div>
  );
};

export default GestionClients;