import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Printer, CheckCircle, XCircle, Plus, X, ChevronDown, ChevronUp, 
  Edit, Trash2, Eye, Calendar, User, Briefcase, Mail, Tag, 
  Layers, DollarSign, Search, Filter, BadgeCheck, BadgePercent,
  Settings, CreditCard, ArrowRight, Circle, Check, Clock, TrendingUp
} from 'lucide-react';
import './suivireservation.css';

const GestionReservation = () => {
  // États principaux
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // État du formulaire
  const [newReservation, setNewReservation] = useState({
    formule: '',
    prix: '',
    prix_perso: '',
    nom_complet: '',
    entreprise: '',
    type_perso: [],
    fonctionnalite: [],
    email: '',
    statut: 'en_attente',
    date: new Date().toISOString().split('T')[0]
  });

  // États pour les sélections
  const [currentFeature, setCurrentFeature] = useState('');
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [currentCustomization, setCurrentCustomization] = useState('');
  const [showCustomizationsDropdown, setShowCustomizationsDropdown] = useState(false);

  // Statistiques
  const [stats, setStats] = useState({
    total: 0,
    starter: 0,
    pro: 0,
    enterprise: 0,
    signe: 0,
    perdu: 0,
    en_attente: 0,
    chiffreAffaire: 0
  });

  // Options disponibles
  const featuresOptions = [
    'Support 24/7',
    'API avancée',
    'Support 9h-18h',
    'Formation en ligne',
    'Accès prioritaire',
    'Rapports analytiques',
    'Intégration CRM',
    'Stockage étendu'
  ];

  const customizationsOptions = ['Starter', 'Pro', 'Enterprise'];
  const statutOptions = ['signé', 'perdu', 'en_attente'];

  // Formules avec prix et fonctionnalités par défaut
  const formules = {
    Starter: { 
      prix: 99, 
      features: [
        'Jusqua 2 terrains', 
        'Réservations en ligne', 
        'Paiements intégrés', 
        'Tableau de bord basique', 
        'Support par email'
      ] 
    },
    Pro: { 
      prix: 179, 
      features: [
        'Jusquà 5 terrains', 
        'Réservations en ligne', 
        'Paiements intégrés', 
        'Tableau de bord avancé', 
        'Statistiques détaillées', 
        'Application mobile', 
        'Personnalisation avancée', 
        'Support prioritaire'
      ] 
    },
    Enterprise: { 
      prix: 349, 
      features: [
        'Terrains illimités', 
        'Réservations en ligne', 
        'Paiements intégrés', 
        'Tableau de bord premium', 
        'Statistiques avancées', 
        'Application mobile personnalisée', 
        'Personnalisation complète', 
        'API dédiée', 
        'Support 24/7', 
        'Gestionnaire de compte dédié'
      ] 
    }
  };

  // Calcul des statistiques
  const calculateStats = (data) => {
    const newStats = {
      total: data.length,
      starter: data.filter(r => r.formule === 'Starter').length,
      pro: data.filter(r => r.formule === 'Pro').length,
      enterprise: data.filter(r => r.formule === 'Enterprise').length,
      signe: data.filter(r => r.statut === 'signé').length,
      perdu: data.filter(r => r.statut === 'perdu').length,
      en_attente: data.filter(r => r.statut === 'en_attente').length,
      chiffreAffaire: data
        .filter(r => r.statut === 'signé')
        .reduce((sum, r) => sum + (parseFloat(r.prix) + parseFloat(r.prix_perso || 0)), 0)
    };
    setStats(newStats);
  };

  // Formater les données de tableau
  const formatArrayData = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [data];
      } catch {
        return data.split(',').map(item => item.trim()).filter(item => item);
      }
    }
    return [];
  };

  // Filtrer les réservations
  useEffect(() => {
    let results = [...reservations];
    
    if (filter !== 'all') {
      results = results.filter((r) => r.formule && r.formule.toLowerCase() === filter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (r) =>
          (r.nom_complet && r.nom_complet.toLowerCase().includes(term)) ||
          (r.entreprise && r.entreprise.toLowerCase().includes(term)) ||
          (r.email && r.email.toLowerCase().includes(term)) ||
          (r.fonctionnalite && r.fonctionnalite.some((f) => f && f.toLowerCase().includes(term))) ||
          (r.type_perso && r.type_perso.some((t) => t && t.toLowerCase().includes(term))) ||
          (r.statut && r.statut.toLowerCase().includes(term))
      );
    }
    
    setFilteredReservations(results);
    calculateStats(results);
  }, [searchTerm, filter, reservations]);

  // Mettre à jour le prix quand la formule change
  useEffect(() => {
    if (newReservation.formule && formules[newReservation.formule]) {
      setNewReservation(prev => ({
        ...prev,
        prix: formules[newReservation.formule].prix,
        fonctionnalite: formules[newReservation.formule].features
      }));
    }
  }, [newReservation.formule]);

  // Charger les réservations depuis l'API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reservation');
        const data = await response.json();
        
        if (data.success) {
          const formattedData = data.data.map(res => ({
            ...res,
            type_perso: formatArrayData(res.type_perso),
            fonctionnalite: formatArrayData(res.fonctionnalite)
          }));
          
          setReservations(formattedData);
          setFilteredReservations(formattedData);
          calculateStats(formattedData);
          toast.success('Réservations chargées avec succès');
        } else {
          toast.error(data.message || 'Erreur lors du chargement des réservations');
        }
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        toast.error('Erreur lors du chargement des réservations');
      }
    };

    fetchReservations();
  }, []);

  // Gestion des réservations
  const handleAddReservation = async () => {
    try {
      if (!newReservation.nom_complet || !newReservation.entreprise || !newReservation.email) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }

      const response = await fetch('http://localhost:5000/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newReservation,
          type_perso: newReservation.type_perso,
          fonctionnalite: newReservation.fonctionnalite
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const newReservationData = {
          ...data.data,
          type_perso: formatArrayData(data.data.type_perso),
          fonctionnalite: formatArrayData(data.data.fonctionnalite)
        };
        
        setReservations([...reservations, newReservationData]);
        resetForm();
        setShowModal(false);
        toast.success('Réservation ajoutée avec succès');
      } else {
        toast.error(data.message || 'Erreur lors de l\'ajout de la réservation');
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      toast.error('Erreur lors de l\'ajout de la réservation');
    }
  };

  const handleUpdateReservation = async () => {
    try {
      if (!currentReservation || !currentReservation.id_reservation) {
        toast.error('Aucune réservation sélectionnée');
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/reservation/${currentReservation.id_reservation}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formule: currentReservation.formule,
            prix: currentReservation.prix,
            prix_perso: currentReservation.prix_perso,
            nom_complet: currentReservation.nom_complet,
            entreprise: currentReservation.entreprise,
            type_perso: currentReservation.type_perso,
            fonctionnalite: currentReservation.fonctionnalite,
            email: currentReservation.email,
            date: currentReservation.date,
            statut: currentReservation.statut
          }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        const updatedReservations = reservations.map(res => 
          res.id_reservation === currentReservation.id_reservation ? {
            ...data.data,
            type_perso: formatArrayData(data.data.type_perso),
            fonctionnalite: formatArrayData(data.data.fonctionnalite)
          } : res
        );
        
        setReservations(updatedReservations);
        setShowViewModal(false);
        setIsEditing(false);
        toast.success('Réservation mise à jour avec succès');
      } else {
        toast.error(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de la réservation');
    }
  };

  const handleDeleteReservation = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/reservation/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        const updatedReservations = reservations.filter((r) => r.id_reservation !== id);
        setReservations(updatedReservations);
        toast.success('Réservation supprimée avec succès');
      } else {
        toast.error(data.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error('Erreur lors de la suppression de la réservation');
    }
  };

  // Gestion du formulaire
  const resetForm = () => {
    setNewReservation({
      formule: '',
      prix: '',
      prix_perso: '',
      nom_complet: '',
      entreprise: '',
      type_perso: [],
      fonctionnalite: [],
      email: '',
      date: new Date().toISOString().split('T')[0],
      statut: 'en_attente'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReservation(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentReservation(prev => ({ ...prev, [name]: value }));
  };

  // Gestion des fonctionnalités
  const handleAddFeature = () => {
    if (currentFeature && !newReservation.fonctionnalite.includes(currentFeature)) {
      setNewReservation(prev => ({
        ...prev,
        fonctionnalite: [...prev.fonctionnalite, currentFeature]
      }));
      setCurrentFeature('');
    }
  };

  const handleRemoveFeature = (feature) => {
    setNewReservation(prev => ({
      ...prev,
      fonctionnalite: prev.fonctionnalite.filter((f) => f !== feature)
    }));
  };

  const handleFeatureSelect = (feature) => {
    if (!newReservation.fonctionnalite.includes(feature)) {
      setNewReservation(prev => ({
        ...prev,
        fonctionnalite: [...prev.fonctionnalite, feature]
      }));
    }
    setShowFeaturesDropdown(false);
  };

  // Gestion des personnalisations
  const handleAddCustomizationType = () => {
    if (currentCustomization && !newReservation.type_perso.includes(currentCustomization)) {
      setNewReservation(prev => ({
        ...prev,
        type_perso: [...prev.type_perso, currentCustomization]
      }));
      setCurrentCustomization('');
    }
  };

  const handleRemoveCustomizationType = (type) => {
    setNewReservation(prev => ({
      ...prev,
      type_perso: prev.type_perso.filter((t) => t !== type)
    }));
  };

  const handleCustomizationSelect = (type) => {
    if (!newReservation.type_perso.includes(type)) {
      setNewReservation(prev => ({
        ...prev,
        type_perso: [...prev.type_perso, type]
      }));
    }
    setShowCustomizationsDropdown(false);
  };

  // Utilitaires
  const getBadgeClass = (formule) => {
    if (!formule) return 'badge-basique';
    switch (formule.toLowerCase()) {
      case 'starter': return 'badge-premium';
      case 'pro': return 'badge-standard';
      case 'enterprise': return 'badge-standard';
      default: return 'badge-basique';
    }
  };

  const getStatutClass = (statut) => {
    switch (statut) {
      case 'signé': return 'status-signed';
      case 'perdu': return 'status-lost';
      case 'en_attente': return 'status-pending';
      default: return 'status-pending';
    }
  };

  const viewReservation = (reservation) => {
    setCurrentReservation({ 
      ...reservation,
      type_perso: formatArrayData(reservation.type_perso),
      fonctionnalite: formatArrayData(reservation.fonctionnalite)
    });
    setShowViewModal(true);
    setIsEditing(false);
  };

  const calculateTotal = (reservation) => {
    const basePrice = parseFloat(reservation.prix) || 0;
    const customPrice = parseFloat(reservation.prix_perso) || 0;
    return (basePrice + customPrice).toFixed(2);
  };
  const printInvoice = () => {
    const content = document.getElementById('invoice-print').innerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Facture #${currentReservation.id_reservation}</title>
          <style>
            @page {
              size: A4;
              margin: 1cm;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #f0f0f0;
            }
            .invoice-title {
              font-size: 28px;
              font-weight: 700;
              color: #2c3e50;
              margin-bottom: 5px;
            }
            .invoice-subtitle {
              font-size: 14px;
              color: #7f8c8d;
              margin-bottom: 15px;
            }
            .invoice-logo {
              display: flex;
              align-items: center;
              font-size: 18px;
              font-weight: 700;
              color: #3498db;
            }
            .logo-circle {
              width: 40px;
              height: 40px;
              background-color: #3498db;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 10px;
              color: white;
              font-weight: bold;
            }
            .invoice-details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .client-info, .invoice-info {
              flex: 1;
            }
            .info-title {
              font-size: 16px;
              font-weight: 600;
              color: #2c3e50;
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 1px solid #eee;
            }
            .info-row {
              display: flex;
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: 600;
              min-width: 120px;
              color: #7f8c8d;
            }
            .status-badge {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 600;
              margin-left: 10px;
            }
            .status-signed {
              background-color: #e8f5e9;
              color: #2e7d32;
            }
            .status-pending {
              background-color: #fff8e1;
              color: #f57f17;
            }
            .status-lost {
              background-color: #ffebee;
              color: #c62828;
            }
            .formule-badge {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 600;
              margin-left: 10px;
            }
            .badge-premium {
              background-color: #e3f2fd;
              color: #1565c0;
            }
            .badge-standard {
              background-color: #f3e5f5;
              color: #8e24aa;
            }
            .badge-enterprise {
              background-color: #e8eaf6;
              color: #3949ab;
            }
            .invoice-items {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .invoice-items th {
              background-color: #f5f5f5;
              padding: 10px;
              text-align: left;
              font-weight: 600;
              color: #2c3e50;
              border-bottom: 2px solid #eee;
            }
            .invoice-items td {
              padding: 12px 10px;
              border-bottom: 1px solid #eee;
            }
            .invoice-items tr:last-child td {
              border-bottom: none;
            }
            .invoice-total {
              margin-top: 20px;
              text-align: right;
            }
            .total-row {
              display: inline-block;
              margin-bottom: 10px;
            }
            .total-label {
              font-weight: 600;
              min-width: 150px;
              display: inline-block;
              text-align: right;
              padding-right: 20px;
            }
            .total-amount {
              font-size: 18px;
              font-weight: 700;
              color: #2c3e50;
              margin-top: 10px;
              padding-top: 10px;
              border-top: 2px solid #eee;
            }
            .invoice-footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #f0f0f0;
              text-align: center;
              color: #7f8c8d;
              font-size: 14px;
            }
            .features-list, .customizations-list {
              margin: 10px 0;
              padding-left: 20px;
            }
            .features-list li, .customizations-list li {
              margin-bottom: 5px;
              position: relative;
            }
            .features-list li:before {
              content: "✓";
              color: #4caf50;
              position: absolute;
              left: -20px;
            }
            .customizations-list li:before {
              content: "•";
              color: #3498db;
              position: absolute;
              left: -20px;
            }
            .section-title {
              font-size: 18px;
              font-weight: 600;
              color: #2c3e50;
              margin: 25px 0 10px 0;
              padding-bottom: 5px;
              border-bottom: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div>
              <div class="invoice-title">Facture</div>
              <div class="invoice-subtitle">Réservation #${currentReservation.id_reservation}</div>
            </div>
            <div class="invoice-logo">
              <div class="logo-circle">FS</div>
              Footspace Solutions
            </div>
          </div>

          <div class="invoice-details">
            <div class="client-info">
              <div class="info-title">Client</div>
              <div class="info-row">
                <div class="info-label">Nom:</div>
                <div>${currentReservation.nom_complet || '-'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Entreprise:</div>
                <div>${currentReservation.entreprise || '-'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Email:</div>
                <div>${currentReservation.email || '-'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Statut:</div>
                <div>
                  ${currentReservation.statut || 'en_attente'}
                  <span class="status-badge ${getStatutClass(currentReservation.statut)}">
                    ${currentReservation.statut === 'signé' ? 'Payé' : 
                      currentReservation.statut === 'perdu' ? 'Annulé' : 'En attente'}
                  </span>
                </div>
              </div>
            </div>
            <div class="invoice-info">
              <div class="info-title">Facture</div>
              <div class="info-row">
                <div class="info-label">Date:</div>
                <div>${
                  currentReservation.date ? 
                  new Date(currentReservation.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : '-'
                }</div>
              </div>
              <div class="info-row">
                <div class="info-label">Formule:</div>
                <div>
                  ${currentReservation.formule || '-'}
                  <span class="formule-badge ${getBadgeClass(currentReservation.formule)}">
                    ${currentReservation.formule || ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="section-title">Détails de la réservation</div>
          
          <table class="invoice-items">
            <thead>
              <tr>
                <th>Description</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Abonnement ${currentReservation.formule || 'Standard'}</td>
                <td>${currentReservation.prix || '0'} €</td>
              </tr>
              <tr>
                <td>Personnalisations supplémentaires</td>
                <td>${currentReservation.prix_perso || '0'} €</td>
              </tr>
              <tr>
                <td><strong>Total HT</strong></td>
                <td><strong>${calculateTotal(currentReservation)} €</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="section-title">Personnalisations</div>
          <ul class="customizations-list">
            ${
              currentReservation.type_perso && currentReservation.type_perso.length > 0 ? 
              currentReservation.type_perso.map(type => `<li>${type}</li>`).join('') : 
              '<li>Aucune personnalisation supplémentaire</li>'
            }
          </ul>

          <div class="section-title">Fonctionnalités incluses</div>
          <ul class="features-list">
            ${
              currentReservation.fonctionnalite && currentReservation.fonctionnalite.length > 0 ? 
              currentReservation.fonctionnalite.map(feature => `<li>${feature}</li>`).join('') : 
              '<li>Aucune fonctionnalité supplémentaire</li>'
            }
          </ul>

          <div class="invoice-total">
            <div class="total-row">
              <span class="total-label">Montant total:</span>
              <span>${calculateTotal(currentReservation)} €</span>
            </div>
            <div class="total-amount">
              Net à payer: ${calculateTotal(currentReservation)} €
            </div>
          </div>

          <div class="invoice-footer">
            <p>Merci pour votre confiance ! Pour toute question, contactez-nous à contact@footspace-solutions.com</p>
            <p>Footspace Solutions - SAS au capital de 50 000 € - RCS Casablanca 123 456 789</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 1000);
  };
  const enableEditing = () => {
    setIsEditing(true);
  };

  return (
    <div className="global-container">
      <div className="gestion-reservation-container">
        {/* En-tête */}
        <header className="gestion-reservation-header">
          <div className="gestion-reservation-title">
            <div className="gestion-reservation-icon">
              <Layers size={24} />
            </div>
            <h1>Gestion des Réservations</h1>
          </div>
          <button 
            className="filter-btn filter-btn-primary" 
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <Plus size={16} className="mr-2" />
            Nouvelle Réservation
          </button>
        </header>

        {/* Cartes de statistiques */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon bg-blue-100 text-blue-600">
              <Layers size={24} />
            </div>
            <div>
              <h3>Total Réservations</h3>
              <p>{stats.total}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-green-100 text-green-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3>Chiffre d'affaires</h3>
              <p>{stats.chiffreAffaire.toFixed(2)} €</p>
              <div className="text-xs text-gray-500 mt-1">Signé seulement</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-purple-100 text-purple-600">
              <BadgeCheck size={24} />
            </div>
            <div>
              <h3>Formules</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="badge-premium">
                  <BadgeCheck size={12} className="mr-1" />
                  Starter: {stats.starter}
                </span>
                <span className="badge-standard">
                  <BadgePercent size={12} className="mr-1" />
                  Pro: {stats.pro}
                </span>
                <span className="badge-enterprise">
                  <Settings size={12} className="mr-1" />
                  Enterprise: {stats.enterprise}
                </span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-yellow-100 text-yellow-600">
              <Clock size={24} />
            </div>
            <div>
              <h3>Statuts</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="status-signed">
                  Signé: {stats.signe}
                </span>
                <span className="status-lost">
                  Perdu: {stats.perdu}
                </span>
                <span className="status-pending">
                  En attente: {stats.en_attente}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="search-filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Rechercher des réservations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={16} className="search-icon" />
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-btn filter-btn-outline ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              <Filter size={14} className="mr-1" />
              Toutes
            </button>
            <button
              className={`filter-btn filter-btn-outline ${filter === 'starter' ? 'active' : ''}`}
              onClick={() => setFilter('starter')}
            >
              <BadgeCheck size={14} className="mr-1" />
              Starter
            </button>
            <button
              className={`filter-btn filter-btn-outline ${filter === 'pro' ? 'active' : ''}`}
              onClick={() => setFilter('pro')}
            >
              <BadgePercent size={14} className="mr-1" />
              Pro
            </button>
            <button
              className={`filter-btn filter-btn-outline ${filter === 'enterprise' ? 'active' : ''}`}
              onClick={() => setFilter('enterprise')}
            >
              <Settings size={14} className="mr-1" />
              Enterprise
            </button>
          </div>
        </div>

        {/* Tableau des réservations */}
        <div className="reservations-container">
          <div className="reservations-header">
            <div className="reservations-count">
              {filteredReservations.length}{' '}
              {filteredReservations.length === 1 ? 'réservation trouvée' : 'réservations trouvées'}
            </div>
          </div>
          {filteredReservations.length > 0 ? (
            <div className="table-responsive">
              <table className="reservations-table">
                <thead>
                  <tr>
                    <th>Formule</th>
                    <th>Prix</th>
                    <th>Perso.</th>
                    <th>Client</th>
                    <th>Entreprise</th>
                    <th>Email</th>
                    <th>Personnalisation</th>
                    <th>Fonctionnalités</th>
                    <th>Total</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id_reservation}>
                      <td>
                        <span className={`badge ${getBadgeClass(reservation.formule)}`}>
                          {reservation.formule === 'Starter' && <BadgeCheck size={14} className="mr-1" />}
                          {reservation.formule === 'Pro' && <BadgePercent size={14} className="mr-1" />}
                          {reservation.formule === 'Enterprise' && <Settings size={14} className="mr-1" />}
                          {reservation.formule || 'Non spécifié'}
                        </span>
                      </td>
                      <td>{reservation.prix || '0'} €</td>
                      <td>{reservation.prix_perso || '0'} €</td>
                      <td>
                        <div className="client-info">
                          <User size={16} className="mr-2" />
                          <span>{reservation.nom_complet || '-'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="client-info">
                          <Briefcase size={16} className="mr-2" />
                          <span>{reservation.entreprise || '-'}</span>
                        </div>
                      </td>
                      <td>
                        <a href={`mailto:${reservation.email}`} className="email-link">
                          <Mail size={16} className="mr-2" />
                          {reservation.email || '-'}
                        </a>
                      </td>
                      <td>
                        <div className="tags-container">
                          {reservation.type_perso && reservation.type_perso.length > 0 ? (
                            reservation.type_perso.map((type, index) => (
                              <span key={index} className="tag">
                                <Circle size={8} className="mr-1" />
                                {type}
                              </span>
                            ))
                          ) : (
                            <span className="no-data">-</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="tags-container">
                          {reservation.fonctionnalite && reservation.fonctionnalite.length > 0 ? (
                            reservation.fonctionnalite.map((feature, index) => (
                              <span key={index} className="tag">
                                <Check size={8} className="mr-1" />
                                {feature}
                              </span>
                            ))
                          ) : (
                            <span className="no-data">-</span>
                          )}
                        </div>
                      </td>
                      <td>{calculateTotal(reservation)} €</td>
                      <td>
                        <span className={`status ${getStatutClass(reservation.statut)}`}>
                          {reservation.statut || 'en_attente'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn action-btn-view"
                            onClick={() => viewReservation(reservation)}
                            title="Voir les détails"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="action-btn action-btn-delete"
                            onClick={() => handleDeleteReservation(reservation.id_reservation)}
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Layers size={48} strokeWidth={1.5} />
              </div>
              <h3>Aucune réservation trouvée</h3>
              <p>Essayez de modifier vos critères de recherche ou ajoutez une nouvelle réservation</p>
              <button 
                className="filter-btn filter-btn-primary"
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
              >
                <Plus size={16} className="mr-2" />
                Ajouter une réservation
              </button>
            </div>
          )}
        </div>

        {/* Modal d'ajout */}
        {showModal && (
          <div className="modal-overlay active">
            <div className="modal">
              <div className="modal-header">
                <h2>
                  <Plus size={20} className="mr-2" />
                  Nouvelle Réservation
                </h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <Tag size={16} className="mr-2" />
                      Formule *
                    </label>
                    <select
                      name="formule"
                      value={newReservation.formule}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    >
                      <option value="">Sélectionnez une formule</option>
                      <option value="Starter">Starter</option>
                      <option value="Pro">Pro</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>
                      <DollarSign size={16} className="mr-2" />
                      Prix *
                    </label>
                    <input
                      type="number"
                      name="prix"
                      value={newReservation.prix}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <DollarSign size={16} className="mr-2" />
                      Prix Perso. *
                    </label>
                    <input
                      type="number"
                      name="prix_perso"
                      value={newReservation.prix_perso}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <User size={16} className="mr-2" />
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="nom_complet"
                      value={newReservation.nom_complet}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <Briefcase size={16} className="mr-2" />
                      Entreprise *
                    </label>
                    <input
                      type="text"
                      name="entreprise"
                      value={newReservation.entreprise}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <Mail size={16} className="mr-2" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newReservation.email}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <Calendar size={16} className="mr-2" />
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={newReservation.date}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <CheckCircle size={16} className="mr-2" />
                      Statut *
                    </label>
                    <select
                      name="statut"
                      value={newReservation.statut}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    >
                      <option value="en_attente">En attente</option>
                      <option value="signé">Signé</option>
                      <option value="perdu">Perdu</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Types de Personnalisation</label>
                  <div className="multiselect">
                    <div
                      className="multiselect-input"
                      onClick={() => setShowCustomizationsDropdown(!showCustomizationsDropdown)}
                    >
                      {newReservation.type_perso.map((type) => (
                        <span key={type} className="tag">
                          {type}
                          <span
                            className="tag-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveCustomizationType(type);
                            }}
                          >
                            <X size={12} />
                          </span>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="Ajouter un type de personnalisation"
                        value={currentCustomization}
                        onChange={(e) => setCurrentCustomization(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCustomizationType()}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCustomizationsDropdown(true);
                        }}
                        className="multiselect-input-field"
                      />
                      <button 
                        className="dropdown-toggle"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCustomizationsDropdown(!showCustomizationsDropdown);
                        }}
                      >
                        {showCustomizationsDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                    {showCustomizationsDropdown && (
                      <div className="multiselect-options active">
                        {customizationsOptions
                          .filter(
                            (option) =>
                              option.toLowerCase().includes(currentCustomization.toLowerCase()) &&
                              !newReservation.type_perso.includes(option)
                          )
                          .map((option) => (
                            <div
                              key={option}
                              className="multiselect-option"
                              onClick={() => handleCustomizationSelect(option)}
                            >
                              <Circle size={8} className="mr-2" />
                              {option}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label>Fonctionnalités Incluses</label>
                  <div className="multiselect">
                    <div
                      className="multiselect-input"
                      onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                    >
                      {newReservation.fonctionnalite.map((feature) => (
                        <span key={feature} className="tag">
                          {feature}
                          <span
                            className="tag-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFeature(feature);
                            }}
                          >
                            <X size={12} />
                          </span>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="Ajouter une fonctionnalité"
                        value={currentFeature}
                        onChange={(e) => setCurrentFeature(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFeaturesDropdown(true);
                        }}
                        className="multiselect-input-field"
                      />
                      <button 
                        className="dropdown-toggle"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFeaturesDropdown(!showFeaturesDropdown);
                        }}
                      >
                        {showFeaturesDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                    {showFeaturesDropdown && (
                      <div className="multiselect-options active">
                        {featuresOptions
                          .filter(
                            (option) =>
                              option.toLowerCase().includes(currentFeature.toLowerCase()) &&
                              !newReservation.fonctionnalite.includes(option)
                          )
                          .map((option) => (
                            <div
                              key={option}
                              className="multiselect-option"
                              onClick={() => handleFeatureSelect(option)}
                            >
                              <Check size={8} className="mr-2" />
                              {option}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="filter-btn filter-btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  <X size={16} className="mr-2" />
                  Annuler
                </button>
                <button
                  className="filter-btn filter-btn-primary"
                  onClick={handleAddReservation}
                  disabled={
                    !newReservation.formule ||
                    !newReservation.prix ||
                    !newReservation.prix_perso ||
                    !newReservation.nom_complet ||
                    !newReservation.entreprise ||
                    !newReservation.email ||
                    !newReservation.date ||
                    !newReservation.statut
                  }
                >
                  <CheckCircle size={16} className="mr-2" />
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de visualisation / modification */}
        {showViewModal && currentReservation && (
          <div className="modal-overlay active">
            <div className="modal">
              <div className="modal-header">
                <h2>
                  {isEditing ? (
                    <Edit size={20} className="mr-2" />
                  ) : (
                    <Eye size={20} className="mr-2" />
                  )}
                  Détails de la Réservation
                </h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowViewModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
              <div className="invoice-container" id="invoice-print">
              <div className="invoice-header">
                    <div>
                      <div className="invoice-title">Facture</div>
                      <div className="invoice-number">
                        Réservation #{currentReservation.id_reservation}
                      </div>
                      <div className="invoice-date">
                        Date: {currentReservation.date ? 
                          new Date(currentReservation.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : '-'}
                      </div>
                    </div>
                    <div className="invoice-logo">
                      <span className="w-6 h-6 bg-blue-500 rounded-full mr-2"></span>
                      Footspace-solutions
                    </div>
                  </div>
                  <div className="invoice-details">
                    <div className="invoice-section">
                      <h3>Client</h3>
                      {isEditing ? (
                        <>
                          <div className="form-group">
                            <label>Nom complet</label>
                            <input
                              type="text"
                              name="nom_complet"
                              value={currentReservation.nom_complet}
                              onChange={handleEditInputChange}
                              className="edit-input"
                            />
                          </div>
                          <div className="form-group">
                            <label>Entreprise</label>
                            <input
                              type="text"
                              name="entreprise"
                              value={currentReservation.entreprise}
                              onChange={handleEditInputChange}
                              className="edit-input"
                            />
                          </div>
                          <div className="form-group">
                            <label>Email</label>
                            <input
                              type="email"
                              name="email"
                              value={currentReservation.email}
                              onChange={handleEditInputChange}
                              className="edit-input"
                            />
                          </div>
                          <div className="form-group">
                            <label>Statut</label>
                            <select
                              name="statut"
                              value={currentReservation.statut}
                              onChange={handleEditInputChange}
                              className="edit-input"
                            >
                              <option value="en_attente">En attente</option>
                              <option value="signé">Signé</option>
                              <option value="perdu">Perdu</option>
                            </select>
                          </div>
                        </>
                      ) : (
                        <>
                          <p><strong>Nom:</strong> {currentReservation.nom_complet || '-'}</p>
                          <p><strong>Entreprise:</strong> {currentReservation.entreprise || '-'}</p>
                          <p><strong>Email:</strong> {currentReservation.email || '-'}</p>
                          <p><strong>Statut:</strong> 
                            <span className={`status ${getStatutClass(currentReservation.statut)}`}>
                              {currentReservation.statut || 'en_attente'}
                            </span>
                          </p>
                        </>
                      )}
                    </div>
                    <div className="invoice-section">
                      <h3>Réservation</h3>
                      {isEditing ? (
                        <>
                          <div className="form-group">
                            <label>Formule</label>
                            <select
                              name="formule"
                              value={currentReservation.formule}
                              onChange={handleEditInputChange}
                              className="edit-input"
                            >
                              <option value="Starter">Starter</option>
                              <option value="Pro">Pro</option>
                              <option value="Enterprise">Enterprise</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Date</label>
                            <input
                              type="date"
                              name="date"
                              value={currentReservation.date}
                              onChange={handleEditInputChange}
                              className="edit-input"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <p>
                            <strong>Formule:</strong> 
                            <span className={`badge ${getBadgeClass(currentReservation.formule)}`}>
                              {currentReservation.formule || '-'}
                            </span>
                          </p>
                          <p>
                            <strong>Date:</strong> {currentReservation.date ? 
                              new Date(currentReservation.date).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : '-'}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="invoice-personnalisation">
                    <h3>Types de Personnalisation</h3>
                    {isEditing ? (
                      <div className="multiselect">
                        <div className="multiselect-input">
                          {currentReservation.type_perso.map((type) => (
                            <span key={type} className="tag">
                              {type}
                              <span
                                className="tag-remove"
                                onClick={() => {
                                  setCurrentReservation(prev => ({
                                    ...prev,
                                    type_perso: prev.type_perso.filter(t => t !== type)
                                  }));
                                }}
                              >
                                <X size={12} />
                              </span>
                            </span>
                          ))}
                          <input
                            type="text"
                            placeholder="Ajouter un type"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && e.target.value) {
                                setCurrentReservation(prev => ({
                                  ...prev,
                                  type_perso: [...prev.type_perso, e.target.value]
                                }));
                                e.target.value = '';
                              }
                            }}
                            className="multiselect-input-field"
                          />
                          <button 
                            className="dropdown-toggle"
                            onClick={() => setShowCustomizationsDropdown(!showCustomizationsDropdown)}
                          >
                            {showCustomizationsDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                        {showCustomizationsDropdown && (
                          <div className="multiselect-options active">
                            {customizationsOptions
                              .filter(option => !currentReservation.type_perso.includes(option))
                              .map((option) => (
                                <div
                                  key={option}
                                  className="multiselect-option"
                                  onClick={() => {
                                    setCurrentReservation(prev => ({
                                      ...prev,
                                      type_perso: [...prev.type_perso, option]
                                    }));
                                    setShowCustomizationsDropdown(false);
                                  }}
                                >
                                  <Circle size={8} className="mr-2" />
                                  {option}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <ul>
                        {currentReservation.type_perso && currentReservation.type_perso.length > 0 ? (
                          currentReservation.type_perso.map((type, idx) => (
                            <li key={idx}>
                              <Circle size={8} className="mr-2" />
                              {type}
                            </li>
                          ))
                        ) : (
                          <li>Aucune personnalisation</li>
                        )}
                      </ul>
                    )}
                  </div>
                  <div className="invoice-features">
                    <h3>Fonctionnalités Incluses</h3>
                    {isEditing ? (
                      <div className="multiselect">
                        <div className="multiselect-input">
                          {currentReservation.fonctionnalite.map((feature) => (
                            <span key={feature} className="tag">
                              {feature}
                              <span
                                className="tag-remove"
                                onClick={() => {
                                  setCurrentReservation(prev => ({
                                    ...prev,
                                    fonctionnalite: prev.fonctionnalite.filter(f => f !== feature)
                                  }));
                                }}
                              >
                                <X size={12} />
                              </span>
                            </span>
                          ))}
                          <input
                            type="text"
                            placeholder="Ajouter une fonctionnalité"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && e.target.value) {
                                setCurrentReservation(prev => ({
                                  ...prev,
                                  fonctionnalite: [...prev.fonctionnalite, e.target.value]
                                }));
                                e.target.value = '';
                              }
                            }}
                            className="multiselect-input-field"
                          />
                          <button 
                            className="dropdown-toggle"
                            onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                          >
                            {showFeaturesDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                        {showFeaturesDropdown && (
                          <div className="multiselect-options active">
                            {featuresOptions
                              .filter(option => !currentReservation.fonctionnalite.includes(option))
                              .map((option) => (
                                <div
                                  key={option}
                                  className="multiselect-option"
                                  onClick={() => {
                                    setCurrentReservation(prev => ({
                                      ...prev,
                                      fonctionnalite: [...prev.fonctionnalite, option]
                                    }));
                                    setShowFeaturesDropdown(false);
                                  }}
                                >
                                  <Check size={8} className="mr-2" />
                                  {option}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <ul>
                        {currentReservation.fonctionnalite && currentReservation.fonctionnalite.length > 0 ? (
                          currentReservation.fonctionnalite.map((feature, idx) => (
                            <li key={idx}>
                              <Check size={8} className="mr-2" />
                              {feature}
                            </li>
                          ))
                        ) : (
                          <li>Aucune fonctionnalité supplémentaire</li>
                        )}
                      </ul>
                    )}
                  </div>
                  <div className="invoice-total">
                    <h3>Détail du prix</h3>
                    {isEditing ? (
                      <>
                        <div className="price-edit">
                          <label>Prix de base:</label>
                          <div className="price-input">
                            <input
                              type="number"
                              name="prix"
                              value={currentReservation.prix}
                              onChange={handleEditInputChange}
                              min="0"
                              step="0.01"
                            />
                            <span>€</span>
                          </div>
                        </div>
                        <div className="price-edit">
                          <label>Prix personnalisation:</label>
                          <div className="price-input">
                            <input
                              type="number"
                              name="prix_perso"
                              value={currentReservation.prix_perso}
                              onChange={handleEditInputChange}
                              min="0"
                              step="0.01"
                            />
                            <span>€</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="price-row">
                          <span>Prix de base:</span>
                          <span>{currentReservation.prix || '0'} €</span>
                        </div>
                        <div className="price-row">
                          <span>Prix personnalisation:</span>
                          <span>{currentReservation.prix_perso || '0'} €</span>
                        </div>
                      </>
                    )}
                    <div className="total-amount">
                      <span>Total:</span>
                      <span>{calculateTotal(currentReservation)} €</span>
                    </div>
                  </div>
                  <div className="invoice-footer">
                    <p>Merci pour votre confiance !</p>
                    <p>B2B Réservations - contact@b2b-reservations.com</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {!isEditing ? (
                  <>
                    <button
                      className="filter-btn filter-btn-outline no-print"
                      onClick={() => setShowViewModal(false)}
                    >
                      <X size={16} className="mr-2" />
                      Fermer
                    </button>
                    <button 
                      className="filter-btn filter-btn-primary no-print"
                      onClick={printInvoice}
                    >
                      <Printer size={16} className="mr-2" />
                      Imprimer
                    </button>
                    <button
                      className="filter-btn filter-btn-primary no-print"
                      onClick={enableEditing}
                    >
                      <Edit size={16} className="mr-2" />
                      Modifier
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="filter-btn filter-btn-outline no-print"
                      onClick={() => setIsEditing(false)}
                    >
                      <X size={16} className="mr-2" />
                      Annuler
                    </button>
                    <button
                      className="filter-btn filter-btn-primary no-print"
                      onClick={handleUpdateReservation}
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Enregistrer
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionReservation;