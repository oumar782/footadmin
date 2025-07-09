import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Suivipartenariats.css';

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
    formErrors: {},
    stats: {
      active: 0,
      inactive: 0,
      total: 0
    },
    currentPartnership: null,
    viewPartnership: null,
    isLoading: false,
    isModalOpen: false,
    isViewModalOpen: false,
    isSubmitting: false
  });

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
        partnerships: response.data.data,
        pagination: {
          ...prev.pagination,
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages
        },
        isLoading: false
      }));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur de chargement des partenariats');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/statsp`);
      setState(prev => ({
        ...prev,
        stats: response.data.data
      }));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur de chargement des statistiques');
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPartnerships();
  }, [state.filters]);

  const openModal = (partnership = null) => {
    setState(prev => ({
      ...prev,
      currentPartnership: partnership,
      formData: partnership ? {
        nom: partnership.nom,
        type: partnership.type,
        date_debut: partnership.date_debut.split('T')[0],
        date_fin: partnership.date_fin ? partnership.date_fin.split('T')[0] : '',
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
      formErrors: {},
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [name]: value },
      formErrors: { ...prev.formErrors, [name]: null }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      const payload = {
        ...state.formData,
        date_fin: state.formData.date_fin || null
      };

      let response;
      if (state.currentPartnership) {
        response = await axios.put(`${API_BASE_URL}/${state.currentPartnership.id_partenariat}`, payload);
      } else {
        response = await axios.post(API_BASE_URL, payload);
      }

      toast.success(response.data.message);
      closeModal();
      await fetchStats();
      fetchPartnerships(state.pagination.page);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = {};
        err.response.data.errors.forEach(error => {
          const field = error.match(/Le champ (.*?) est invalide/)?.[1];
          if (field) errors[field] = error;
        });
        setState(prev => ({ ...prev, formErrors: errors }));
      } else {
        toast.error(err.response?.data?.error || 'Erreur lors de la soumission');
      }
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const deletePartnership = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce partenariat ?")) {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        const response = await axios.delete(`${API_BASE_URL}/${id}`);
        toast.success(response.data.message);
        await fetchStats();
        fetchPartnerships(state.pagination.page);
      } catch (err) {
        toast.error(err.response?.data?.error || 'Erreur lors de la suppression');
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const renderStatus = (status) => (
    <span className={`sp-status sp-status-${status}`}>
      {status === 'active' ? 'Actif' : 'Inactif'}
    </span>
  );

  const StatsCards = () => (
    <div className="sp-stats-container">
      <div className="sp-stat-card sp-stat-total">
        <h3>Total Partenariats</h3>
        <div className="sp-stat-value">{state.stats.total}</div>
        <div className="sp-stat-label">Tous les partenariats</div>
      </div>
      <div className="sp-stat-card sp-stat-active">
        <h3>Actifs</h3>
        <div className="sp-stat-value">{state.stats.active}</div>
        <div className="sp-stat-label">Partenariats en cours</div>
      </div>
      <div className="sp-stat-card sp-stat-inactive">
        <h3>Inactifs</h3>
        <div className="sp-stat-value">{state.stats.inactive}</div>
        <div className="sp-stat-label">Partenariats terminés</div>
      </div>
    </div>
  );

  const PaginationControls = () => (
    <div className="sp-pagination">
      <button 
        onClick={() => fetchPartnerships(state.pagination.page - 1)} 
        disabled={state.pagination.page === 1 || state.isLoading}
        className="sp-pagination-btn"
      >
        &lt; Précédent
      </button>
      <span className="sp-pagination-info">
        Page {state.pagination.page} sur {state.pagination.totalPages} 
        ({state.pagination.total} résultats)
      </span>
      <button 
        onClick={() => fetchPartnerships(state.pagination.page + 1)} 
        disabled={state.pagination.page >= state.pagination.totalPages || state.isLoading}
        className="sp-pagination-btn"
      >
        Suivant &gt;
      </button>
    </div>
  );

  return (
    <div className="sp-container">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="sp-header">
        <h1 className="sp-title">Gestion des Partenariats</h1>
        <button 
          className="sp-btn sp-btn-primary" 
          onClick={() => openModal()} 
          disabled={state.isLoading}
        >
          {state.isLoading ? 'Chargement...' : '+ Ajouter un partenariat'}
        </button>
      </div>

      <StatsCards />

      {/* Filters */}
      <div className="sp-filters-container">
        <h3 className="sp-filters-title">Filtrer les partenariats</h3>
        <div className="sp-filter-row">
          <div className="sp-filter-group">
            <label className="sp-filter-label">Nom du partenaire</label>
            <input
              type="text"
              name="name"
              value={state.filters.name}
              onChange={handleFilterChange}
              placeholder="Rechercher par nom..."
              disabled={state.isLoading}
              className="sp-filter-input"
            />
          </div>
          <div className="sp-filter-group">
            <label className="sp-filter-label">Type</label>
            <select
              name="type"
              value={state.filters.type}
              onChange={handleFilterChange}
              disabled={state.isLoading}
              className="sp-filter-select"
            >
              <option value="">Tous les types</option>
              <option value="Sponsoring">Sponsoring</option>
              <option value="Collaboration">Collaboration</option>
              <option value="Partenariat stratégique">Stratégique</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div className="sp-filter-group">
            <label className="sp-filter-label">Statut</label>
            <select
              name="status"
              value={state.filters.status}
              onChange={handleFilterChange}
              disabled={state.isLoading}
              className="sp-filter-select"
            >
              <option value="">Tous</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <button 
            className="sp-btn sp-btn-secondary" 
            onClick={resetFilters} 
            disabled={state.isLoading}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="sp-table-container">
        {state.isLoading ? (
          <div className="sp-loading">Chargement en cours...</div>
        ) : (
          <>
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Type</th>
                  <th>Date début</th>
                  <th>Date fin</th>
                  <th>Contact</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.partnerships.length > 0 ? (
                  state.partnerships.map(partnership => (
                    <tr key={partnership.id_partenariat} className="sp-table-row">
                      <td>
                        <button 
                          className="sp-link-button" 
                          onClick={() => openViewModal(partnership)}
                        >
                          {partnership.nom}
                        </button>
                      </td>
                      <td>{partnership.type}</td>
                      <td>{formatDate(partnership.date_debut)}</td>
                      <td>{formatDate(partnership.date_fin)}</td>
                      <td>
                        {partnership.contact.includes('@') ? (
                          <a href={`mailto:${partnership.contact}`} className="sp-contact-link">{partnership.contact}</a>
                        ) : (
                          <a href={`tel:${partnership.contact}`} className="sp-contact-link">{partnership.contact}</a>
                        )}
                      </td>
                      <td>{renderStatus(partnership.statut)}</td>
                      <td>
                        <div className="sp-actions">
                          <button 
                            className="sp-btn sp-btn-sm sp-btn-info" 
                            onClick={() => openViewModal(partnership)}
                          >
                            Voir
                          </button>
                          <button 
                            className="sp-btn sp-btn-sm sp-btn-warning" 
                            onClick={() => openModal(partnership)}
                          >
                            Modifier
                          </button>
                          <button 
                            className="sp-btn sp-btn-sm sp-btn-danger" 
                            onClick={() => deletePartnership(partnership.id_partenariat)}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="sp-no-results">
                      Aucun partenariat trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <PaginationControls />
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {state.isModalOpen && (
        <div className="sp-modal-overlay active">
          <div className="sp-modal">
            <div className="sp-modal-header">
              <h3>{state.currentPartnership ? 'Modifier le partenariat' : 'Nouveau partenariat'}</h3>
              <button className="sp-modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="sp-modal-form">
              <div className="sp-modal-body">
                <div className="sp-form-group">
                  <label className="sp-form-label">Nom *</label>
                  <input
                    type="text"
                    name="nom"
                    value={state.formData.nom}
                    onChange={handleInputChange}
                    required
                    minLength="2"
                    disabled={state.isSubmitting}
                    className={`sp-form-control ${state.formErrors.nom ? 'sp-error' : ''}`}
                  />
                  {state.formErrors.nom && <div className="sp-error-message">{state.formErrors.nom}</div>}
                </div>

                <div className="sp-form-group">
                  <label className="sp-form-label">Type *</label>
                  <select
                    name="type"
                    value={state.formData.type}
                    onChange={handleInputChange}
                    required
                    disabled={state.isSubmitting}
                    className={`sp-form-control ${state.formErrors.type ? 'sp-error' : ''}`}
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="Sponsoring">Sponsoring</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Partenariat stratégique">Partenariat stratégique</option>
                    <option value="Autre">Autre</option>
                  </select>
                  {state.formErrors.type && <div className="sp-error-message">{state.formErrors.type}</div>}
                </div>

                <div className="sp-form-row">
                  <div className="sp-form-group">
                    <label className="sp-form-label">Date de début *</label>
                    <input
                      type="date"
                      name="date_debut"
                      value={state.formData.date_debut}
                      onChange={handleInputChange}
                      required
                      disabled={state.isSubmitting}
                      className={`sp-form-control ${state.formErrors.date_debut ? 'sp-error' : ''}`}
                    />
                    {state.formErrors.date_debut && <div className="sp-error-message">{state.formErrors.date_debut}</div>}
                  </div>
                  <div className="sp-form-group">
                    <label className="sp-form-label">Date de fin</label>
                    <input
                      type="date"
                      name="date_fin"
                      value={state.formData.date_fin}
                      onChange={handleInputChange}
                      disabled={state.isSubmitting}
                      min={state.formData.date_debut}
                      className="sp-form-control"
                    />
                  </div>
                </div>

                <div className="sp-form-group">
                  <label className="sp-form-label">Contact *</label>
                  <input
                    type="text"
                    name="contact"
                    value={state.formData.contact}
                    onChange={handleInputChange}
                    required
                    placeholder="Email ou téléphone"
                    disabled={state.isSubmitting}
                    className={`sp-form-control ${state.formErrors.contact ? 'sp-error' : ''}`}
                  />
                  {state.formErrors.contact && <div className="sp-error-message">{state.formErrors.contact}</div>}
                </div>

                <div className="sp-form-group">
                  <label className="sp-form-label">Statut *</label>
                  <select
                    name="statut"
                    value={state.formData.statut}
                    onChange={handleInputChange}
                    required
                    disabled={state.isSubmitting}
                    className={`sp-form-control ${state.formErrors.statut ? 'sp-error' : ''}`}
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                  {state.formErrors.statut && <div className="sp-error-message">{state.formErrors.statut}</div>}
                </div>
              </div>
              <div className="sp-modal-footer">
                <button 
                  type="button" 
                  className="sp-btn sp-btn-secondary" 
                  onClick={closeModal} 
                  disabled={state.isSubmitting}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="sp-btn sp-btn-primary" 
                  disabled={state.isSubmitting}
                >
                  {state.isSubmitting ? (
                    <span className="sp-spinner"></span>
                  ) : state.currentPartnership ? (
                    'Mettre à jour'
                  ) : (
                    'Créer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {state.isViewModalOpen && state.viewPartnership && (
        <div className="sp-modal-overlay active">
          <div className="sp-modal">
            <div className="sp-modal-header">
              <h3>Détails du partenariat</h3>
              <button className="sp-modal-close" onClick={closeViewModal}>&times;</button>
            </div>
            <div className="sp-modal-body">
              <div className="sp-partner-details">
                <div className="sp-detail-item">
                  <span className="sp-detail-label">Nom:</span>
                  <span className="sp-detail-value">{state.viewPartnership.nom}</span>
                </div>
                <div className="sp-detail-item">
                  <span className="sp-detail-label">Type:</span>
                  <span className="sp-detail-value">{state.viewPartnership.type}</span>
                </div>
                <div className="sp-detail-item">
                  <span className="sp-detail-label">Date de début:</span>
                  <span className="sp-detail-value">{formatDate(state.viewPartnership.date_debut)}</span>
                </div>
                <div className="sp-detail-item">
                  <span className="sp-detail-label">Date de fin:</span>
                  <span className="sp-detail-value">{formatDate(state.viewPartnership.date_fin)}</span>
                </div>
                <div className="sp-detail-item">
                  <span className="sp-detail-label">Contact:</span>
                  <span className="sp-detail-value">
                    {state.viewPartnership.contact.includes('@') ? (
                      <a href={`mailto:${state.viewPartnership.contact}`} className="sp-contact-link">{state.viewPartnership.contact}</a>
                    ) : (
                      <a href={`tel:${state.viewPartnership.contact}`} className="sp-contact-link">{state.viewPartnership.contact}</a>
                    )}
                  </span>
                </div>
                <div className="sp-detail-item">
                  <span className="sp-detail-label">Statut:</span>
                  <span className="sp-detail-value">
                    {renderStatus(state.viewPartnership.statut)}
                  </span>
                </div>
              </div>
            </div>
            <div className="sp-modal-footer">
              <button
                type="button"
                className="sp-btn sp-btn-primary"
                onClick={() => {
                  closeViewModal();
                  openModal(state.viewPartnership);
                }}
              >
                Modifier
              </button>
              <button
                type="button"
                className="sp-btn sp-btn-secondary"
                onClick={closeViewModal}
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