import React, { useState, useEffect } from 'react';
import './Gestionpartenariats.css';

const PartnershipManagement = () => {
  const [partnerships, setPartnerships] = useState([]);
  const [filteredPartnerships, setFilteredPartnerships] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPartnership, setCurrentPartnership] = useState(null);
  const [viewPartnership, setViewPartnership] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    startDate: '',
    endDate: '',
    contact: '',
    status: 'active'
  });
  const [filters, setFilters] = useState({
    name: '',
    type: '',
    status: ''
  });

  // Load sample data
  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        name: 'Entreprise A',
        type: 'Sponsoring',
        startDate: '2023-01-15',
        endDate: '2023-12-31',
        contact: 'contact@entreprisea.com',
        status: 'active'
      },
      {
        id: 2,
        name: 'Organisation B',
        type: 'Collaboration',
        startDate: '2022-06-01',
        endDate: '2023-05-31',
        contact: '+33 6 12 34 56 78',
        status: 'inactive'
      },
      {
        id: 3,
        name: 'Société C',
        type: 'Partenariat stratégique',
        startDate: '2023-03-10',
        endDate: '2024-03-09',
        contact: 'partenariat@societec.com',
        status: 'active'
      }
    ];
    setPartnerships(sampleData);
    setFilteredPartnerships(sampleData);
  }, []);

  // Apply filters when filters or partnerships change
  useEffect(() => {
    const filtered = partnerships.filter(partnership => {
      return (
        partnership.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        (filters.type === '' || partnership.type === filters.type) &&
        (filters.status === '' || partnership.status === filters.status)
      );
    });
    setFilteredPartnerships(filtered);
  }, [filters, partnerships]);

  const openModal = (partnership = null) => {
    if (partnership) {
      setCurrentPartnership(partnership);
      setFormData({
        name: partnership.name,
        type: partnership.type,
        startDate: partnership.startDate,
        endDate: partnership.endDate,
        contact: partnership.contact,
        status: partnership.status
      });
    } else {
      setCurrentPartnership(null);
      setFormData({
        name: '',
        type: '',
        startDate: '',
        endDate: '',
        contact: '',
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  const openViewModal = (partnership) => {
    setViewPartnership(partnership);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentPartnership) {
      // Update existing partnership
      const updatedPartnerships = partnerships.map(p => 
        p.id === currentPartnership.id ? { ...p, ...formData } : p
      );
      setPartnerships(updatedPartnerships);
    } else {
      // Add new partnership
      const newPartnership = {
        id: partnerships.length + 1,
        ...formData
      };
      setPartnerships([...partnerships, newPartnership]);
    }
    
    closeModal();
  };

  const deletePartnership = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce partenariat ?')) {
      setPartnerships(partnerships.filter(p => p.id !== id));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const resetFilters = () => {
    setFilters({
      name: '',
      type: '',
      status: ''
    });
  };

  return (
    <div className="containerpart ">
      <div className="header">
        <h1>Gestion des Partenariats</h1>
        <button className="btnpart btn-primary" onClick={() => openModal()}>
          Ajouter un partenariat
        </button>
      </div>

      {/* Filtres de recherche */}
      <div className="filters-container">
        <h3>Filtrer les partenariats</h3>
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="filter-name">Nom du partenaire</label>
            <input
              type="text"
              id="filter-name"
              name="name"
              className="form-control"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Rechercher par nom..."
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="filter-type">Type de partenariat</label>
            <select
              id="filter-type"
              name="type"
              className="form-control"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">Tous les types</option>
              <option value="Sponsoring">Sponsoring</option>
              <option value="Collaboration">Collaboration</option>
              <option value="Partenariat stratégique">Partenariat stratégique</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="filter-status">Statut</label>
            <select
              id="filter-status"
              name="status"
              className="form-control"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          
          <button className="btnpart btn-secondary" onClick={resetFilters}>
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nom du partenaire</th>
              <th>Type de partenariat</th>
              <th>Date de début</th>
              <th>Date de fin</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartnerships.length > 0 ? (
              filteredPartnerships.map(partnership => (
                <tr key={partnership.id}>
                  <td>
                    <a 
                      href="#!" 
                      onClick={(e) => {
                        e.preventDefault();
                        openViewModal(partnership);
                      }}
                      style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
                    >
                      {partnership.name}
                    </a>
                  </td>
                  <td>{partnership.type}</td>
                  <td>{new Date(partnership.startDate).toLocaleDateString()}</td>
                  <td>{new Date(partnership.endDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status status-${partnership.status}`}>
                      {partnership.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button 
                        className="btnpart btn-sm btn-info" 
                        onClick={() => openViewModal(partnership)}
                      >
                        Voir
                      </button>
                      <button 
                        className="btnpart btn-sm btn-warning" 
                        onClick={() => openModal(partnership)}
                      >
                        Modifier
                      </button>
                      <button 
                        className="btnpart btn-sm btn-danger" 
                        onClick={() => deletePartnership(partnership.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">
                  Aucun partenariat trouvé avec les critères sélectionnés
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal d'édition/ajout */}
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`}>
        <div className="modal">
          <div className="modal-header">
            <h3>{currentPartnership ? 'Modifier le partenariat' : 'Ajouter un partenariat'}</h3>
            <button className="modal-close" onClick={closeModal}>&times;</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Nom du partenaire</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="type">Type de partenariat</label>
                <select
                  id="type"
                  name="type"
                  className="form-control"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="Sponsoring">Sponsoring</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="Partenariat stratégique">Partenariat stratégique</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="startDate">Date de début</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="form-control"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">Date de fin</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="form-control"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact">Contact (email ou téléphone)</label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  className="form-control"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Statut</label>
                <select
                  id="status"
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btnpart" onClick={closeModal}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                {currentPartnership ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de visualisation */}
      <div className={`modal-overlay ${isViewModalOpen ? 'active' : ''}`}>
        <div className="modal">
          <div className="modal-header">
            <h3>Détails du partenariat</h3>
            <button className="modal-close" onClick={closeViewModal}>&times;</button>
          </div>
          <div className="modal-body">
            {viewPartnership && (
              <>
                <div className="detail-item">
                  <div className="detail-label">Nom du partenaire</div>
                  <div className="detail-value">{viewPartnership.name}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Type de partenariat</div>
                  <div className="detail-value">{viewPartnership.type}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Date de début</div>
                  <div className="detail-value">{formatDate(viewPartnership.startDate)}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Date de fin</div>
                  <div className="detail-value">{formatDate(viewPartnership.endDate)}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Contact</div>
                  <div className="detail-value">{viewPartnership.contact}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Statut</div>
                  <div className="detail-value">
                    <span className={`status status-${viewPartnership.status}`}>
                      {viewPartnership.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btnpar btn-primary" 
              onClick={() => {
                closeViewModal();
                openModal(viewPartnership);
              }}
            >
              Modifier
            </button>
            <button type="button" className="btnpar" onClick={closeViewModal}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipManagement;