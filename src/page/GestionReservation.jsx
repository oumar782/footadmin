import React, { useState, useEffect } from 'react';
import './GestionReservation.css';

const GestionReservation = () => {
  // Données initiales
  const initialReservations = [
    {
      id: 1,
      formule: "Premium",
      prix: "499",
      prixPersonnalisation: "150",
      nomComplet: "Jean Dupont",
      entreprise: "Dupont SA",
      telephone: "+33 6 12 34 56 78",
      typesDePersonnalisation: ["Logo personnalisé", "Couleurs spécifiques"],
      description: "Réservation avec support prioritaire et API avancée",
      fonctionnalitesIncluses: ["Support 24/7", "API avancée", "Accès prioritaire"],
      date: "2023-05-15",
      reference: "RES-2023-001"
    },
    {
      id: 2,
      formule: "Standard",
      prix: "299",
      prixPersonnalisation: "75",
      nomComplet: "Marie Martin",
      entreprise: "Martin & Cie",
      telephone: "+33 6 23 45 67 89",
      typesDePersonnalisation: ["Couleurs spécifiques"],
      description: "Formule standard avec formation en ligne",
      fonctionnalitesIncluses: ["Support 9h-18h", "Formation en ligne"],
      date: "2023-05-10",
      reference: "RES-2023-002"
    },
    {
      id: 3,
      formule: "Basique",
      prix: "149",
      prixPersonnalisation: "0",
      nomComplet: "Pierre Lambert",
      entreprise: "Lambert Industries",
      telephone: "+33 6 34 56 78 90",
      typesDePersonnalisation: ["Aucune"],
      description: "Formule économique sans options supplémentaires",
      fonctionnalitesIncluses: ["Support 9h-18h"],
      date: "2023-05-05",
      reference: "RES-2023-003"
    }
  ];

  // États
  const [reservations, setReservations] = useState(initialReservations);
  const [filteredReservations, setFilteredReservations] = useState(initialReservations);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);

  const [newReservation, setNewReservation] = useState({
    formule: "",
    prix: "",
    prixPersonnalisation: "",
    nomComplet: "",
    entreprise: "",
    telephone: "",
    typesDePersonnalisation: [],
    description: "",
    fonctionnalitesIncluses: [],
    date: new Date().toISOString().split('T')[0],
    reference: `RES-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  });

  const [currentFeature, setCurrentFeature] = useState("");
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [currentCustomization, setCurrentCustomization] = useState("");
  const [showCustomizationsDropdown, setShowCustomizationsDropdown] = useState(false);

  // Options pour les fonctionnalités
  const featuresOptions = [
    "Support 24/7",
    "API avancée",
    "Support 9h-18h",
    "Formation en ligne",
    "Accès prioritaire",
    "Rapports analytiques",
    "Intégration CRM",
    "Stockage étendu"
  ];

  // Options pour les personnalisations
  const customizationsOptions = [
    "Logo personnalisé",
    "Couleurs spécifiques",
    "Interface adaptée",
    "Aucune"
  ];

  // Filtrage des réservations
  useEffect(() => {
    let results = reservations;

    if (filter !== "all") {
      results = results.filter(r => r.formule.toLowerCase() === filter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(r =>
        r.nomComplet.toLowerCase().includes(term) ||
        r.entreprise.toLowerCase().includes(term) ||
        r.reference.toLowerCase().includes(term) ||
        r.fonctionnalitesIncluses.some(f => f.toLowerCase().includes(term))
      );
    }

    setFilteredReservations(results);
  }, [searchTerm, filter, reservations]);

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReservation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Ajout d'une nouvelle réservation
  const handleAddReservation = () => {
    const newId = reservations.length > 0 ? Math.max(...reservations.map(r => r.id)) + 1 : 1;
    const updatedReservations = [...reservations, { id: newId, ...newReservation }];
    setReservations(updatedReservations);
    resetForm();
    setShowModal(false);
  };

  // Suppression d'une réservation
  const handleDeleteReservation = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      setReservations(prev => prev.filter(r => r.id !== id));
    }
  };

  // Gestion des fonctionnalités incluses
  const handleAddFeature = () => {
    if (currentFeature && !newReservation.fonctionnalitesIncluses.includes(currentFeature)) {
      setNewReservation(prev => ({
        ...prev,
        fonctionnalitesIncluses: [...prev.fonctionnalitesIncluses, currentFeature]
      }));
      setCurrentFeature("");
    }
  };

  const handleRemoveFeature = (feature) => {
    setNewReservation(prev => ({
      ...prev,
      fonctionnalitesIncluses: prev.fonctionnalitesIncluses.filter(f => f !== feature)
    }));
  };

  const handleFeatureSelect = (feature) => {
    if (!newReservation.fonctionnalitesIncluses.includes(feature)) {
      setNewReservation(prev => ({
        ...prev,
        fonctionnalitesIncluses: [...prev.fonctionnalitesIncluses, feature]
      }));
    }
    setShowFeaturesDropdown(false);
  };

  // Gestion des types de personnalisation
  const handleAddCustomizationType = () => {
    if (currentCustomization && !newReservation.typesDePersonnalisation.includes(currentCustomization)) {
      setNewReservation(prev => ({
        ...prev,
        typesDePersonnalisation: [...prev.typesDePersonnalisation, currentCustomization]
      }));
      setCurrentCustomization("");
    }
  };

  const handleRemoveCustomizationType = (type) => {
    setNewReservation(prev => ({
      ...prev,
      typesDePersonnalisation: prev.typesDePersonnalisation.filter(t => t !== type)
    }));
  };

  const handleCustomizationSelect = (type) => {
    if (!newReservation.typesDePersonnalisation.includes(type)) {
      setNewReservation(prev => ({
        ...prev,
        typesDePersonnalisation: [...prev.typesDePersonnalisation, type]
      }));
    }
    setShowCustomizationsDropdown(false);
  };

  // Réinitialisation du formulaire
  const resetForm = () => {
    setNewReservation({
      formule: "",
      prix: "",
      prixPersonnalisation: "",
      nomComplet: "",
      entreprise: "",
      telephone: "",
      typesDePersonnalisation: [],
      description: "",
      fonctionnalitesIncluses: [],
      date: new Date().toISOString().split('T')[0],
      reference: `RES-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    });
  };

  // Classes CSS pour les badges
  const getBadgeClass = (formule) => {
    switch(formule.toLowerCase()) {
      case 'premium': return 'badge-premium';
      case 'standard': return 'badge-standard';
      default: return 'badge-basique';
    }
  };

  // Affichage d'une réservation
  const viewReservation = (reservation) => {
    setCurrentReservation(reservation);
    setShowViewModal(true);
  };

  // Calcul du total
  const calculateTotal = (reservation) => {
    const basePrice = parseInt(reservation.prix) || 0;
    const customPrice = parseInt(reservation.prixPersonnalisation) || 0;
    return `${basePrice + customPrice} €`;
  };

  // Impression de la facture
  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="containergr">
      {/* En-tête */}
      <header className="app-headergre">
        <div className="app-titlegr">
          <div className="app-icongr">R</div>
          <h1>Gestion des Réservation</h1>
        </div>
        <button className="btnre btn-primary" onClick={() => setShowModal(true)}>
          Nouvelle Réservation
        </button>
      </header>

      {/* Barre de recherche et filtres */}
      <div className="search-filter-container">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Rechercher des réservations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button className={`btnre btn-outline ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            Toutes
          </button>
          <button className={`btnre btn-outline ${filter === 'premium' ? 'active' : ''}`} onClick={() => setFilter('premium')}>
            Premium
          </button>
          <button className={`btnre btn-outline ${filter === 'standard' ? 'active' : ''}`} onClick={() => setFilter('standard')}>
            Standard
          </button>
          <button className={`btnre btn-outline ${filter === 'basique' ? 'active' : ''}`} onClick={() => setFilter('basique')}>
            Basique
          </button>
        </div>
      </div>

      {/* Tableau des réservations */}
      <div className="reservations-container">
        <div className="reservations-header">
          <div className="reservations-count">
            {filteredReservations.length} {filteredReservations.length === 1 ? 'réservation' : 'réservations'}
          </div>
        </div>
        {filteredReservations.length > 0 ? (
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Formule</th>
                <th>Prix</th>
                <th>Perso.</th>
                <th>Nom Complet</th>
                <th>Entreprise</th>
                <th>Types de Personnalisation</th>
                <th>Description</th>
                <th>Fonctionnalités Incluses</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map(reservation => (
                <tr key={reservation.id}>
                  <td><span className={`badge ${getBadgeClass(reservation.formule)}`}>{reservation.formule}</span></td>
                  <td>{reservation.prix} €</td>
                  <td>{reservation.prixPersonnalisation} €</td>
                  <td>{reservation.nomComplet}</td>
                  <td>{reservation.entreprise}</td>
                  <td>{reservation.typesDePersonnalisation.join(', ')}</td>
                  <td>{reservation.description}</td>
                  <td>{reservation.fonctionnalitesIncluses.join(', ')}</td>
                  <td>{calculateTotal(reservation)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-secondary btn-sm" onClick={() => viewReservation(reservation)}>
                        Voir
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteReservation(reservation.id)}>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>Aucune réservation trouvée</h3>
            <p>Essayez de modifier vos critères de recherche ou ajoutez une nouvelle réservation</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              Ajouter une réservation
            </button>
          </div>
        )}
      </div>

      {/* Modal d'ajout */}
      <div className={`modal-overlay ${showModal ? 'active' : ''}`}>
        <div className="modal">
          <div className="modal-header">
            <h2>Nouvelle Réservation</h2>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Formule *</label>
                <select name="formule" value={newReservation.formule} onChange={handleInputChange} required>
                  <option value="">Sélectionnez une formule</option>
                  <option value="Basique">Basique</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
              <div className="form-group">
                <label>Prix *</label>
                <input type="text" name="prix" value={newReservation.prix} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Prix Perso. *</label>
                <input type="text" name="prixPersonnalisation" value={newReservation.prixPersonnalisation} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Nom complet *</label>
                <input type="text" name="nomComplet" value={newReservation.nomComplet} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Entreprise *</label>
                <input type="text" name="entreprise" value={newReservation.entreprise} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input type="text" name="telephone" value={newReservation.telephone} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input type="date" name="date" value={newReservation.date} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={newReservation.description} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Types de Personnalisation</label>
              <div className="multiselect">
                <div className="multiselect-input" onClick={() => setShowCustomizationsDropdown(!showCustomizationsDropdown)}>
                  {newReservation.typesDePersonnalisation.map(type => (
                    <span key={type} className="tag">
                      {type}
                      <span className="tag-remove" onClick={(e) => { e.stopPropagation(); handleRemoveCustomizationType(type); }}>
                        &times;
                      </span>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Ajouter un type de personnalisation"
                    value={currentCustomization}
                    onChange={(e) => setCurrentCustomization(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomizationType()}
                    onClick={(e) => { e.stopPropagation(); setShowCustomizationsDropdown(true); }}
                  />
                </div>
                <div className={`multiselect-options ${showCustomizationsDropdown ? 'active' : ''}`}>
                  {customizationsOptions
                    .filter(option => 
                      option.toLowerCase().includes(currentCustomization.toLowerCase()) && 
                      !newReservation.typesDePersonnalisation.includes(option)
                    )
                    .map(option => (
                      <div key={option} className="multiselect-option" onClick={() => handleCustomizationSelect(option)}>
                        {option}
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Fonctionnalités Incluses</label>
              <div className="multiselect">
                <div className="multiselect-input" onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}>
                  {newReservation.fonctionnalitesIncluses.map(feature => (
                    <span key={feature} className="tag">
                      {feature}
                      <span className="tag-remove" onClick={(e) => { e.stopPropagation(); handleRemoveFeature(feature); }}>
                        &times;
                      </span>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Ajouter une fonctionnalité"
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                    onClick={(e) => { e.stopPropagation(); setShowFeaturesDropdown(true); }}
                  />
                </div>
                <div className={`multiselect-options ${showFeaturesDropdown ? 'active' : ''}`}>
                  {featuresOptions
                    .filter(option => 
                      option.toLowerCase().includes(currentFeature.toLowerCase()) && 
                      !newReservation.fonctionnalitesIncluses.includes(option)
                    )
                    .map(option => (
                      <div key={option} className="multiselect-option" onClick={() => handleFeatureSelect(option)}>
                        {option}
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="form-footer">
            <button className="btn btn-outline" onClick={() => { setShowModal(false); resetForm(); }}>
              Annuler
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleAddReservation}
              disabled={!newReservation.formule || !newReservation.prix || !newReservation.prixPersonnalisation || 
                        !newReservation.nomComplet || !newReservation.entreprise || !newReservation.date}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>

      {/* Modal de visualisation */}
      <div className={`modal-overlay ${showViewModal ? 'active' : ''}`}>
        <div className="modal" style={{ maxWidth: '800px' }}>
          <div className="modal-header">
            <h2>Détails de la Réservation</h2>
            <button className="close-btn" onClick={() => setShowViewModal(false)}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            {currentReservation && (
              <div className="invoice-container">
                <div className="invoice-header">
                  <div className="invoice-title">Détail</div>
                  <div className="invoice-logo">B2B Réservations</div>
                </div>
                <div className="invoice-details">
                  <div>
                    <div className="invoice-section">
                      <h3>Client</h3>
                      <p>{currentReservation.nomComplet}</p>
                      <p>{currentReservation.entreprise}</p>
                      <p>{currentReservation.telephone}</p>
                    </div>
                  </div>
                  <div>
                    <div className="invoice-section">
                      <h3>Référence</h3>
                      <p>{currentReservation.reference}</p>
                      <p>Date: {new Date(currentReservation.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>
                <div className="invoice-description">
                  <h3>Description</h3>
                  <p>{currentReservation.description}</p>
                </div>
                <div className="invoice-personnalisation">
                  <h3>Types de Personnalisation</h3>
                  <ul>
                    {currentReservation.typesDePersonnalisation.map((type, idx) => (
                      <li key={idx}>{type}</li>
                    ))}
                  </ul>
                </div>
                <div className="invoice-features">
                  <h3>Fonctionnalités Incluses</h3>
                  <ul>
                    {currentReservation.fonctionnalitesIncluses.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="invoice-total">
                  Prix Total: {calculateTotal(currentReservation)}
                </div>
                <div className="invoice-footer">
                  <p>Merci pour votre confiance !</p>
                  <p>B2B Réservations - contact@b2b-reservations.com - +33 1 23 45 67 89</p>
                </div>
              </div>
            )}
          </div>
          <div className="form-footer">
            <button className="btn btn-outline no-print" onClick={() => setShowViewModal(false)}>
              Fermer
            </button>
            <button className="btn btn-primary no-print" onClick={printInvoice}>
              Imprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionReservation;