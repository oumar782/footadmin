import React, { useState, useEffect } from 'react';
import { FaPlus, FaEye, FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import './Gestionclient.css';

const Gestionclient = () => {
  // Sample client data
  const initialClients = [
    { id: 1, name: "Jean Dupont", email: "jean.dupont@example.com", phone: "0612345678", address: "12 Rue de la Paix, Paris", status: "active", date: "15/05/2023" },
    { id: 2, name: "Marie Martin", email: "marie.martin@example.com", phone: "0698765432", address: "24 Avenue des Champs-Élysées, Paris", status: "active", date: "10/05/2023" },
    { id: 3, name: "Pierre Durand", email: "pierre.durand@example.com", phone: "0678912345", address: "8 Boulevard Saint-Germain, Paris", status: "inactive", date: "05/05/2023" },
    { id: 4, name: "Sophie Lambert", email: "sophie.lambert@example.com", phone: "0634567891", address: "36 Rue de Rivoli, Paris", status: "active", date: "01/05/2023" },
    { id: 5, name: "Thomas Moreau", email: "thomas.moreau@example.com", phone: "0623456789", address: "5 Place de la Concorde, Paris", status: "active", date: "25/04/2023" },
    { id: 6, name: "Laura Petit", email: "laura.petit@example.com", phone: "0691234567", address: "18 Rue du Faubourg Saint-Honoré, Paris", status: "inactive", date: "20/04/2023" },
    { id: 7, name: "Nicolas Leroy", email: "nicolas.leroy@example.com", phone: "0687654321", address: "9 Avenue Montaigne, Paris", status: "active", date: "15/04/2023" },
    { id: 8, name: "Emma Bernard", email: "emma.bernard@example.com", phone: "0645678912", address: "22 Rue de Sèvres, Paris", status: "active", date: "10/04/2023" },
    { id: 9, name: "Alexandre Roux", email: "alexandre.roux@example.com", phone: "0634567891", address: "14 Rue de la Pompe, Paris", status: "inactive", date: "05/04/2023" },
    { id: 10, name: "Camille Laurent", email: "camille.laurent@example.com", phone: "0678912345", address: "7 Rue de Passy, Paris", status: "active", date: "01/04/2023" }
  ];

  // State
  const [clients, setClients] = useState(initialClients);
  const [filteredClients, setFilteredClients] = useState(initialClients);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [filterBy, setFilterBy] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [toast, setToast] = useState(null);
  const itemsPerPage = 5;

  // Form states
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active'
  });

  const [editClient, setEditClient] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active'
  });

  // Filter, sort and paginate clients
  useEffect(() => {
    let result = [...clients];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(client => 
        client.name.toLowerCase().includes(term) || 
        client.email.toLowerCase().includes(term) ||
        client.phone.toLowerCase().includes(term)
      );
    }
    
    // Filter by status
    if (filterBy !== 'all') {
      result = result.filter(client => client.status === filterBy);
    }
    
    // Sort clients
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'date-recent':
        result.sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));
        break;
      case 'date-old':
        result.sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')));
        break;
      default:
        break;
    }
    
    setFilteredClients(result);
    setCurrentPage(1);
  }, [clients, searchTerm, sortBy, filterBy]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Show toast message
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle add client
  const handleAddClient = () => {
    const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
    const clientToAdd = {
      ...newClient,
      id: newId,
      date: new Date().toLocaleDateString('fr-FR')
    };
    
    setClients([clientToAdd, ...clients]);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      address: '',
      status: 'active'
    });
    setShowAddModal(false);
    showToast('Client ajouté avec succès', 'success');
  };

  // Handle edit client
  const handleEditClient = () => {
    setClients(clients.map(client => 
      client.id === editClient.id ? { ...client, ...editClient } : client
    ));
    setShowEditModal(false);
    showToast('Client modifié avec succès', 'success');
  };

  // Handle delete client
  const handleDeleteClient = () => {
    setClients(clients.filter(client => client.id !== selectedClient.id));
    setShowDeleteModal(false);
    showToast('Client supprimé avec succès', 'success');
  };

  // Open view modal
  const openViewModal = (client) => {
    setSelectedClient(client);
    setShowViewModal(true);
  };

  // Open edit modal
  const openEditModal = (client) => {
    setEditClient({ ...client });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (client) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="containerts">
      <div className="table-containerss">
        {/* Header */}
        <div className="headercli">
          <h1>Gestion des Clients</h1>
          <button 
            className="btnclit btn-primarycli"
            onClick={() => setShowAddModal(true)}
          >
            Ajouter Client
          </button>
        </div>
        
        {/* Search and Filters */}
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
              <option value="name-asc">Trier par nom (A-Z)</option>
              <option value="name-desc">Trier par nom (Z-A)</option>
              <option value="date-recent">Date récente</option>
              <option value="date-old">Date ancienne</option>
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
        
        {/* Clients Table */}
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClients.length > 0 ? (
                paginatedClients.map(client => (
                  <tr key={client.id}>
                    <td>{client.id}</td>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.phone}</td>
                    <td>
                      <span className={`badge ${client.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                        {client.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => openViewModal(client)}
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => openEditModal(client)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => openDeleteModal(client)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    Aucun client trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="pagination">
          <div className="pagination-info">
            Affichage de {startIndex + 1} à {Math.min(endIndex, filteredClients.length)} sur {filteredClients.length} clients
          </div>
          <div className="pagination-controls">
            <button 
              className="pagination-btn"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button 
              className="pagination-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
      
      {/* Add Client Modal */}
      {showAddModal && (
        <div className="modal-overlaygc">
          <div className="modalgc">
            <div className="modal-header">
              <h3>Ajouter un Client</h3>
              <button onClick={() => setShowAddModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nom Complet</label>
                <input
                  type="text"
                  className="form-control"
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Adresse</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={newClient.address}
                  onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Statut</label>
                <select
                  className="form-control"
                  value={newClient.status}
                  onChange={(e) => setNewClient({...newClient, status: e.target.value})}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Annuler
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAddClient}
                disabled={!newClient.name || !newClient.email || !newClient.phone}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* View Client Modal */}
      {showViewModal && selectedClient && (
        <div className="modal-overlaygc">
          <div className="modalgc">
            <div className="modal-header">
              <h3>Détails du Client</h3>
              <button onClick={() => setShowViewModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="client-header">
                <div className="client-avatar">
                  {getInitials(selectedClient.name)}
                </div>
                <div className="client-details">
                  <h2 className="client-name">{selectedClient.name}</h2>
                  <span className={`badge ${selectedClient.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                    {selectedClient.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Email</div>
                <div className="detail-value">{selectedClient.email}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Téléphone</div>
                <div className="detail-value">{selectedClient.phone}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Adresse</div>
                <div className="detail-value">{selectedClient.address}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Date d'ajout</div>
                <div className="detail-value">{selectedClient.date}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-primary"
                onClick={() => setShowViewModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Client Modal */}
      {showEditModal && (
        <div className="modal-overlaygc">
          <div className="modalgc">
            <div className="modal-header">
              <h3>Modifier le Client</h3>
              <button onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nom Complet</label>
                <input
                  type="text"
                  className="form-control"
                  value={editClient.name}
                  onChange={(e) => setEditClient({...editClient, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={editClient.email}
                  onChange={(e) => setEditClient({...editClient, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={editClient.phone}
                  onChange={(e) => setEditClient({...editClient, phone: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Adresse</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={editClient.address}
                  onChange={(e) => setEditClient({...editClient, address: e.target.value})}
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Statut</label>
                <select
                  className="form-control"
                  value={editClient.status}
                  onChange={(e) => setEditClient({...editClient, status: e.target.value})}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Annuler
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleEditClient}
                disabled={!editClient.name || !editClient.email || !editClient.phone}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedClient && (
        <div className="modal-overlaygc">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button onClick={() => setShowDeleteModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-bodygc">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  backgroundColor: '#fee2e2', 
                  color: '#ef4444', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginRight: '16px',
                  fontSize: '20px'
                }}>
                  <FaTimes />
                </div>
                <p>Êtes-vous sûr de vouloir supprimer le client {selectedClient.name} ? Cette action est irréversible.</p>
              </div>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Toutes les informations associées à ce client seront définitivement supprimées.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDeleteClient}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Gestionclient;