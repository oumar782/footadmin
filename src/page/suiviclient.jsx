import React, { useState, useEffect } from 'react';
import { FaPlus, FaEye, FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import './suiviclient.css';

const Gestionclient = () => {
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({ 
    active: 0, 
    inactive: 0,
    total: 0,
    activePerMinute: 0,
    inactivePerMinute: 0,
    totalPerMinute: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('nom_client-asc');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [newClient, setNewClient] = useState({
    nom_client: '',
    prenom: '',
    email: '',
    statut: 'active'
  });

  const [editClient, setEditClient] = useState({
    id_client: '',
    nom_client: '',
    prenom: '',
    email: '',
    statut: 'active'
  });

  const [toast, setToast] = useState(null);
  const itemsPerPage = 5;

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/client/?search=${searchTerm}&statut=${filterBy}&sort=${sortBy}&page=${currentPage}&limit=${itemsPerPage}`
      );
      const data = await response.json();
      
      if (data.success) {
        setClients(data.data);
        setTotalPages(data.pagination.totalPages);
        
        const statsResponse = await fetch('http://localhost:5000/api/client/stats');
        const statsData = await statsResponse.json();
        
        if (statsData.success) {
          setStats(statsData.data);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      showToast('Erreur lors du chargement des clients', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [searchTerm, filterBy, sortBy, currentPage]);

  const handleAddClient = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/client/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });
      
      const data = await response.json();
      if (data.success) {
        setNewClient({ nom_client: '', prenom: '', email: '', statut: 'active' });
        setShowAddModal(false);
        showToast('Client ajouté avec succès', 'success');
        fetchClients();
      } else {
        showToast(data.message || 'Erreur lors de l\'ajout', 'error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showToast('Erreur lors de l\'ajout du client', 'error');
    }
  };

  const handleEditClient = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/client/${editClient.id_client}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editClient)
      });
      
      const data = await response.json();
      if (data.success) {
        setShowEditModal(false);
        showToast('Client modifié avec succès', 'success');
        fetchClients();
      } else {
        showToast(data.message || 'Erreur lors de la modification', 'error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showToast('Erreur lors de la modification du client', 'error');
    }
  };

  const handleDeleteClient = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/client/${selectedClient.id_client}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        setShowDeleteModal(false);
        showToast('Client supprimé avec succès', 'success');
        fetchClients();
      } else {
        showToast(data.message || 'Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showToast('Erreur lors de la suppression du client', 'error');
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getFullName = (client) => `${client.nom_client} ${client.prenom}`;
  const getInitials = (client) => `${client.nom_client[0]}${client.prenom[0]}`.toUpperCase();

  return (
    <div className="containerts">
      <div className="table-containerss">
        <div className="headercli">
          <h1>Gestion des Clients</h1>
          <button className="btnclit btn-primarycli" onClick={() => setShowAddModal(true)}>
            <FaPlus /> Ajouter Client
          </button>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card stat-active">
            <h3>Clients Actifs</h3>
            <div className="stat-value">{stats.active}</div>
            <div className="stat-trend">
              {stats.activePerMinute > 0 ? '+' : ''}{stats.activePerMinute}/min
            </div>
          </div>
          <div className="stat-card stat-inactive">
            <h3>Clients Inactifs</h3>
            <div className="stat-value">{stats.inactive}</div>
            <div className="stat-trend">
              {stats.inactivePerMinute > 0 ? '+' : ''}{stats.inactivePerMinute}/min
            </div>
          </div>
          <div className="stat-card stat-total">
            <h3>Total Clients</h3>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-trend">
              {stats.totalPerMinute > 0 ? '+' : ''}{stats.totalPerMinute}/min
            </div>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filters">
            <select 
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="nom_client-asc">Trier par nom (A-Z)</option>
              <option value="nom_client-desc">Trier par nom (Z-A)</option>
              <option value="created_at-desc">Date récente</option>
              <option value="created_at-asc">Date ancienne</option>
            </select>
            <select 
              className="filter-select"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="all">Tous les clients</option>
              <option value="active">Clients actifs</option>
              <option value="inactive">Clients inactifs</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
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
              {loading ? (
                <tr>
                  <td colSpan="6" className="loading-text">Chargement en cours...</td>
                </tr>
              ) : clients.length > 0 ? (
                clients.map(client => (
                  <tr key={client.id_client}>
                    <td>{client.id_client}</td>
                    <td>{client.nom_client}</td>
                    <td>{client.prenom}</td>
                    <td>{client.email}</td>
                    <td>
                      <span className={`badge ${client.statut === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                        {client.statut === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => { setSelectedClient(client); setShowViewModal(true); }}
                          title="Voir détails"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => { setEditClient({ ...client }); setShowEditModal(true); }}
                          title="Modifier"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => { setSelectedClient(client); setShowDeleteModal(true); }}
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
                  <td colSpan="6" className="no-data">Aucun client trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </button>
          <span>Page {currentPage} sur {totalPages}</span>
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === totalPages || clients.length < itemsPerPage}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlaygc">
          <div className="modalgc">
            <div className="modal-header">
              <h3>Ajouter un Client</h3>
              <button onClick={() => setShowAddModal(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  value={newClient.nom_client}
                  onChange={(e) => setNewClient({...newClient, nom_client: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Prénom</label>
                <input
                  type="text"
                  value={newClient.prenom}
                  onChange={(e) => setNewClient({...newClient, prenom: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Statut</label>
                <select
                  value={newClient.statut}
                  onChange={(e) => setNewClient({...newClient, statut: e.target.value})}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Annuler
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleAddClient}
                disabled={!newClient.nom_client || !newClient.prenom || !newClient.email}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedClient && (
        <div className="modal-overlaygc">
          <div className="modalgc">
            <div className="modal-header">
              <h3>Détails du Client</h3>
              <button onClick={() => setShowViewModal(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="client-details">
                <div className="client-avatar">
                  <span>{getInitials(selectedClient)}</span>
                </div>
                <div className="client-info">
                  <h4>{getFullName(selectedClient)}</h4>
                  <p><strong>Email:</strong> {selectedClient.email}</p>
                  <p>
                    <strong>Statut:</strong> 
                    <span className={`badge ${selectedClient.statut === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                      {selectedClient.statut === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </p>
                  <p><strong>ID:</strong> {selectedClient.id_client}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setShowViewModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlaygc">
          <div className="modalgc">
            <div className="modal-header">
              <h3>Modifier Client</h3>
              <button onClick={() => setShowEditModal(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  value={editClient.nom_client}
                  onChange={(e) => setEditClient({...editClient, nom_client: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Prénom</label>
                <input
                  type="text"
                  value={editClient.prenom}
                  onChange={(e) => setEditClient({...editClient, prenom: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editClient.email}
                  onChange={(e) => setEditClient({...editClient, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Statut</label>
                <select
                  value={editClient.statut}
                  onChange={(e) => setEditClient({...editClient, statut: e.target.value})}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                Annuler
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleEditClient}
                disabled={!editClient.nom_client || !editClient.prenom || !editClient.email}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedClient && (
        <div className="modal-overlaygc">
          <div className="modalgc">
            <div className="modal-header">
              <h3>Supprimer Client</h3>
              <button onClick={() => setShowDeleteModal(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer le client <strong>{getFullName(selectedClient)}</strong> ?</p>
              <p>Cette action est irréversible.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Annuler
              </button>
              <button className="btn btn-danger" onClick={handleDeleteClient}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Gestionclient;