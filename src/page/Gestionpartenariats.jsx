import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Gestionpartenariats.css';

const API_BASE_URL = 'http://localhost:5000/api/partenariats';

const PartnershipManagement = () => {
  const [state, setState] = useState({
    partnerships: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1
    },
    filters: {
      name: '',
      type: '',
      status: ''
    },
    formData: {
      nom: '',
      type: '',
      date_debut: '',
      date_fin: '',
      contact: '',
      statut: 'active'
    },
    currentPartnership: null,
    viewPartnership: null,
    isLoading: false,
    isModalOpen: false,
    isViewModalOpen: false,
    isSubmitting: false
  });

  // Fetch partnerships with filters
  const fetchPartnerships = async (page = 1) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await axios.get(API_BASE_URL, {
        params: {
          page,
          limit: state.pagination.limit,
          name: state.filters.name,
          type: state.filters.type,
          status: state.filters.status
        }
      });
      
      setState(prev => ({
        ...prev,
        partnerships: response.data.data || [],
        pagination: {
          ...prev.pagination,
          page: response.data.pagination?.page || 1,
          limit: response.data.pagination?.limit || 10,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 1
        },
        isLoading: false
      }));
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error(err.response?.data?.message || 'Erreur de chargement des partenariats');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchPartnerships();
  }, [state.filters]);

  // Modal handlers
  const openModal = (partnership = null) => {
    setState(prev => ({
      ...prev,
      currentPartnership: partnership,
      formData: partnership ? {
        nom: partnership.nom,
        type: partnership.type,
        date_debut: partnership.date_debut,
        date_fin: partnership.date_fin,
        contact: partnership.contact,
        statut: partnership.statut
      } : {
        nom: '',
        type: '',
        date_debut: '',
        date_fin: '',
        contact: '',
        statut: 'active'
      },
      isModalOpen: true
    }));
  };

  const openViewModal = (partnership) => {
    setState(prev => ({ ...prev, viewPartnership: partnership, isViewModalOpen: true }));
  };

  const closeModal = () => {
    setState(prev => ({ ...prev, isModalOpen: false, currentPartnership: null }));
  };

  const closeViewModal = () => {
    setState(prev => ({ ...prev, isViewModalOpen: false }));
  };

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [name]: value }
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [name]: value },
      pagination: { ...prev.pagination, page: 1 }
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const payload = {
        nom: state.formData.nom,
        type: state.formData.type,
        date_debut: state.formData.date_debut,
        date_fin: state.formData.date_fin,
        contact: state.formData.contact,
        statut: state.formData.statut
      };

      let response;
      if (state.currentPartnership) {
        response = await axios.put(`${API_BASE_URL}/${state.currentPartnership.id_partenariat}`, payload);
      } else {
        response = await axios.post(API_BASE_URL, payload);
      }

      toast.success(response.data.message);
      closeModal();
      fetchPartnerships(state.pagination.page);
    } catch (err) {
      console.error('Submit error:', err);
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach(error => toast.error(error));
      } else {
        toast.error(err.response?.data?.message || 'Erreur lors de la soumission');
      }
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Delete partnership
  const deletePartnership = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce partenariat ?")) {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        const response = await axios.delete(`${API_BASE_URL}/${id}`);
        toast.success(response.data.message);
        fetchPartnerships(state.pagination.page);
      } catch (err) {
        console.error('Delete error:', err);
        toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }
  };

  // Reset filters
  const resetFilters = () => {
    setState(prev => ({
      ...prev,
      filters: {
        name: '',
        type: '',
        status: ''
      }
    }));
  };

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const renderStatus = (status) => (
    <span className={`status status-${status}`}>
      {status === 'active' ? 'Actif' : 'Inactif'}
    </span>
  );

  // Pagination controls
  const PaginationControls = () => (
    <div className="pagination">
      <button 
        onClick={() => fetchPartnerships(state.pagination.page - 1)} 
        disabled={state.pagination.page === 1 || state.isLoading}
      >
        Précédent
      </button>
      <span>Page {state.pagination.page} sur {state.pagination.totalPages}</span>
      <button 
        onClick={() => fetchPartnerships(state.pagination.page + 1)} 
        disabled={state.pagination.page >= state.pagination.totalPages || state.isLoading}
      >
        Suivant
      </button>
    </div>
  );

  return (
    <div className="containerpart">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="header">
        <h1>Gestion des Partenariats</h1>
        <button 
          className="btnpart btn-primary" 
          onClick={() => openModal()} 
          disabled={state.isLoading}
        >
          {state.isLoading ? 'Chargement...' : 'Ajouter un partenariat'}
        </button>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <h3>Filtrer les partenariats</h3>
        <div className="filter-row">
          <div className="filter-group">
            <label>Nom du partenaire</label>
            <input
              type="text"
              name="name"
              value={state.filters.name}
              onChange={handleFilterChange}
              placeholder="Rechercher par nom..."
              disabled={state.isLoading}
            />
          </div>
          <div className="filter-group">
            <label>Type de partenariat</label>
            <select
              name="type"
              value={state.filters.type}
              onChange={handleFilterChange}
              disabled={state.isLoading}
            >
              <option value="">Tous les types</option>
              <option value="Sponsoring">Sponsoring</option>
              <option value="Collaboration">Collaboration</option>
              <option value="Partenariat stratégique">Partenariat stratégique</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Statut</label>
            <select
              name="status"
              value={state.filters.status}
              onChange={handleFilterChange}
              disabled={state.isLoading}
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <button 
            className="btnpart btn-secondary" 
            onClick={resetFilters} 
            disabled={state.isLoading}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {state.isLoading ? (
          <div className="loading">Chargement en cours...</div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Nom du partenaire</th>
                  <th>Type</th>
                  <th>Date de début</th>
                  <th>Date de fin</th>
                  <th>Contact</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.partnerships.length > 0 ? (
                  state.partnerships.map(partnership => (
                    <tr key={partnership.id_partenariat}>
                      <td>
                        <button 
                          className="link-button" 
                          onClick={() => openViewModal(partnership)} 
                          disabled={state.isLoading}
                        >
                          {partnership.nom}
                        </button>
                      </td>
                      <td>{partnership.type}</td>
                      <td>{formatDate(partnership.date_debut)}</td>
                      <td>{formatDate(partnership.date_fin)}</td>
                      <td>
                        {partnership.contact.includes('@') ? (
                          <a href={`mailto:${partnership.contact}`}>{partnership.contact}</a>
                        ) : (
                          <a href={`tel:${partnership.contact}`}>{partnership.contact}</a>
                        )}
                      </td>
                      <td>{renderStatus(partnership.statut)}</td>
                      <td>
                        <div className="actions">
                          <button 
                            className="btnpart btn-sm btn-info" 
                            onClick={() => openViewModal(partnership)} 
                            disabled={state.isLoading}
                          >
                            Voir
                          </button>
                          <button 
                            className="btnpart btn-sm btn-warning" 
                            onClick={() => openModal(partnership)} 
                            disabled={state.isLoading}
                          >
                            Modifier
                          </button>
                          <button 
                            className="btnpart btn-sm btn-danger" 
                            onClick={() => deletePartnership(partnership.id_partenariat)} 
                            disabled={state.isLoading}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">Aucun partenariat trouvé</td>
                  </tr>
                )}
              </tbody>
            </table>
            <PaginationControls />
          </>
        )}
      </div>

      {/* Edit/Add Modal */}
      {state.isModalOpen && (
        <div className="modal-overlay active">
          <div className="modal">
            <div className="modal-header">
              <h3>{state.currentPartnership ? 'Modifier le partenariat' : 'Ajouter un partenariat'}</h3>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    name="nom"
                    value={state.formData.nom}
                    onChange={handleInputChange}
                    required
                    minLength="2"
                    disabled={state.isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    name="type"
                    value={state.formData.type}
                    onChange={handleInputChange}
                    required
                    disabled={state.isSubmitting}
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="Sponsoring">Sponsoring</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Partenariat stratégique">Partenariat stratégique</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date de début *</label>
                    <input
                      type="date"
                      name="date_debut"
                      value={state.formData.date_debut}
                      onChange={handleInputChange}
                      required
                      disabled={state.isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label>Date de fin *</label>
                    <input
                      type="date"
                      name="date_fin"
                      value={state.formData.date_fin}
                      onChange={handleInputChange}
                      required
                      disabled={state.isSubmitting}
                      min={state.formData.date_debut}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Contact *</label>
                  <input
                    type="text"
                    name="contact"
                    value={state.formData.contact}
                    onChange={handleInputChange}
                    required
                    placeholder="Email ou téléphone"
                    disabled={state.isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label>Statut *</label>
                  <select
                    name="statut"
                    value={state.formData.statut}
                    onChange={handleInputChange}
                    required
                    disabled={state.isSubmitting}
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btnpart btn-secondary" 
                  onClick={closeModal} 
                  disabled={state.isSubmitting}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btnpart btn-primary" 
                  disabled={state.isSubmitting}
                >
                  {state.isSubmitting ? 'En cours...' : state.currentPartnership ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {state.isViewModalOpen && state.viewPartnership && (
        <div className="modal-overlay active">
          <div className="modal">
            <div className="modal-header">
              <h3>Détails du partenariat</h3>
              <button className="modal-close" onClick={closeViewModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="partner-details">
                <div className="detail-item">
                  <span className="detail-label">Nom:</span>
                  <span className="detail-value">{state.viewPartnership.nom}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{state.viewPartnership.type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Début:</span>
                  <span className="detail-value">{formatDate(state.viewPartnership.date_debut)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"> Date Fin:</span>
                  <span className="detail-value">{formatDate(state.viewPartnership.date_fin)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Contact:</span>
                  <span className="detail-value">
                    {state.viewPartnership.contact.includes('@') ? (
                      <a href={`mailto:${state.viewPartnership.contact}`}>{state.viewPartnership.contact}</a>
                    ) : (
                      <a href={`tel:${state.viewPartnership.contact}`}>{state.viewPartnership.contact}</a>
                    )}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Statut:</span>
                  <span className="detail-value">{renderStatus(state.viewPartnership.statut)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btnpart btn-primary"
                onClick={() => {
                  closeViewModal();
                  openModal(state.viewPartnership);
                }}
                disabled={state.isLoading}
              >
                Modifier
              </button>
              <button 
                type="button" 
                className="btnpart btn-secondary" 
                onClick={closeViewModal} 
                disabled={state.isLoading}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnershipManagement;