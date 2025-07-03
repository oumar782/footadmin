import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Printer, CheckCircle, XCircle, Plus, X, ChevronDown, ChevronUp, 
  Edit, Trash2, Eye, Calendar, User, Briefcase, Mail, Tag, 
  Layers, DollarSign, Search, Filter, BadgeCheck, BadgePercent,
  Settings, CreditCard, ArrowRight, Circle, Check, Clock, HardDrive, 
  Cpu, Shield, BookOpen, BarChart2, Smartphone, Code, Server
} from 'lucide-react';
import './GestionReservation.css';

const GestionReservation = () => {
  // États
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [newReservation, setNewReservation] = useState({
    formule: '',
    prix: '',
    prix_perso: '',
    nom_complet: '',
    entreprise: '',
    type_perso: [],
    fonctionnalite: [],
    email: '',
    telephone: '',
    notes: '',
    statut: 'en_attente',
    date: new Date().toISOString().split('T')[0],
    duree: '1 mois',
    paiement: 'non_paye'
  });

  const [currentFeature, setCurrentFeature] = useState('');
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [currentCustomization, setCurrentCustomization] = useState('');
  const [showCustomizationsDropdown, setShowCustomizationsDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Options
  const featuresOptions = [
    { name: 'Support 24/7', icon: <Clock size={14} /> },
    { name: 'API avancée', icon: <Code size={14} /> },
    { name: 'Support 9h-18h', icon: <Clock size={14} /> },
    { name: 'Formation en ligne', icon: <BookOpen size={14} /> },
    { name: 'Accès prioritaire', icon: <Shield size={14} /> },
    { name: 'Rapports analytiques', icon: <BarChart2 size={14} /> },
    { name: 'Intégration CRM', icon: <Server size={14} /> },
    { name: 'Stockage étendu', icon: <HardDrive size={14} /> },
    { name: 'Application mobile', icon: <Smartphone size={14} /> },
    { name: 'Sauvegarde quotidienne', icon: <HardDrive size={14} /> }
  ];

  const customizationsOptions = ['Starter', 'Pro', 'Enterprise'];
  const statutOptions = ['signé', 'perdu', 'en_attente', 'en_cours'];
  const dureeOptions = ['1 mois', '3 mois', '6 mois', '1 an'];
  const paiementOptions = ['payé', 'non_paye', 'partiel'];

  // Formules avec prix par défaut
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

  // Charger les réservations depuis l'API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reservation');
        const data = await response.json();
        if (data.success) {
          setReservations(data.data.map(res => ({
            ...res,
            type_perso: formatArrayData(res.type_perso),
            fonctionnalite: formatArrayData(res.fonctionnalite)
          })));
          setFilteredReservations(data.data.map(res => ({
            ...res,
            type_perso: formatArrayData(res.type_perso),
            fonctionnalite: formatArrayData(res.fonctionnalite)
          })));
          toast.success('Réservations chargées avec succès');
        } else {
          toast.error('Erreur lors du chargement des réservations');
        }
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        toast.error('Erreur lors du chargement des réservations');
      }
    };

    fetchReservations();
  }, []);

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
          (r.telephone && r.telephone.toLowerCase().includes(term)) ||
          (r.fonctionnalite && r.fonctionnalite.some((f) => f && f.toLowerCase().includes(term))) ||
          (r.type_perso && r.type_perso.some((t) => t && t.toLowerCase().includes(term))) ||
          (r.statut && r.statut.toLowerCase().includes(term)) ||
          (r.notes && r.notes.toLowerCase().includes(term))
      );
    }
    setFilteredReservations(results);
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

  // Ajouter une réservation via l'API
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
        setReservations([...reservations, {
          ...data.data,
          type_perso: formatArrayData(data.data.type_perso),
          fonctionnalite: formatArrayData(data.data.fonctionnalite)
        }]);
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

  // Modifier une réservation via l'API
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...currentReservation,
            type_perso: currentReservation.type_perso,
            fonctionnalite: currentReservation.fonctionnalite
          }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setReservations(reservations.map(res => 
          res.id_reservation === currentReservation.id_reservation ? {
            ...data.data,
            type_perso: formatArrayData(data.data.type_perso),
            fonctionnalite: formatArrayData(data.data.fonctionnalite)
          } : res
        ));
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

  // Supprimer une réservation via l'API
  const handleDeleteReservation = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/reservation/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        setReservations(reservations.filter((r) => r.id_reservation !== id));
        toast.success('Réservation supprimée avec succès');
      } else {
        toast.error(data.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error('Erreur lors de la suppression de la réservation');
    }
  };

  // Réinitialiser le formulaire
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
      telephone: '',
      notes: '',
      statut: 'en_attente',
      date: new Date().toISOString().split('T')[0],
      duree: '1 mois',
      paiement: 'non_paye'
    });
  };

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReservation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gestion des changements pour l'édition
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentReservation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Classes CSS pour les badges
  const getBadgeClass = (formule) => {
    if (!formule) return 'gr-badge-basique';
    switch (formule.toLowerCase()) {
      case 'starter':
        return 'gr-badge-premium';
      case 'pro':
        return 'gr-badge-standard';
      case 'enterprise':
        return 'gr-badge-standard';
      default:
        return 'gr-badge-basique';
    }
  };

  // Classes CSS pour les statuts
  const getStatutClass = (statut) => {
    switch (statut) {
      case 'signé':
        return 'gr-statut-signe';
      case 'perdu':
        return 'gr-statut-perdu';
      case 'en_attente':
        return 'gr-statut-attente';
      case 'en_cours':
        return 'gr-statut-encours';
      default:
        return 'gr-statut-attente';
    }
  };

  // Classes CSS pour le paiement
  const getPaiementClass = (paiement) => {
    switch (paiement) {
      case 'payé':
        return 'gr-paiement-paye';
      case 'non_paye':
        return 'gr-paiement-nonpaye';
      case 'partiel':
        return 'gr-paiement-partiel';
      default:
        return 'gr-paiement-nonpaye';
    }
  };

  // Affichage d'une réservation
  const viewReservation = (reservation) => {
    setCurrentReservation({ 
      ...reservation,
      type_perso: formatArrayData(reservation.type_perso),
      fonctionnalite: formatArrayData(reservation.fonctionnalite)
    });
    setShowViewModal(true);
    setIsEditing(false);
  };

  // Calcul du total
  const calculateTotal = (reservation) => {
    const basePrice = parseFloat(reservation.prix) || 0;
    const customPrice = parseFloat(reservation.prix_perso) || 0;
    return (basePrice + customPrice).toFixed(2);
  };

  // Impression de la facture
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

  // Gestion des fonctionnalités incluses
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

  // Gestion des types de personnalisation
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

  // Activer le mode édition
  const enableEditing = () => {
    setIsEditing(true);
  };

  // Obtenir l'icône pour une fonctionnalité
  const getFeatureIcon = (featureName) => {
    const feature = featuresOptions.find(f => f.name === featureName);
    return feature ? feature.icon : <Check size={12} />;
  };

  return (
    <div className="gr-container">
      {/* En-tête */}
      <header className="gr-app-header">
        <div className="gr-app-title">
          <div className="gr-app-icon">
            <Layers size={24} className="text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Réservations</h1>
        </div>
        <button 
          className="gr-btn gr-btn-primary flex items-center" 
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus size={16} className="mr-2" />
          Nouvelle Réservation
        </button>
      </header>

      {/* Barre de recherche et filtres */}
      <div className="gr-search-filter-container bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="gr-search-box relative">
          <input
            type="text"
            placeholder="Rechercher des réservations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="gr-filter-buttons flex flex-wrap gap-2 mt-4">
          <button
            className={`gr-btn gr-btn-outline ${filter === 'all' ? 'active bg-blue-500 text-white' : ''} flex items-center`}
            onClick={() => setFilter('all')}
          >
            <Filter size={14} className="mr-1" />
            Toutes
          </button>
          <button
            className={`gr-btn gr-btn-outline ${filter === 'starter' ? 'active bg-purple-600 text-white' : ''} flex items-center`}
            onClick={() => setFilter('starter')}
          >
            <BadgeCheck size={14} className="mr-1" />
            Starter
          </button>
          <button
            className={`gr-btn gr-btn-outline ${filter === 'pro' ? 'active bg-blue-600 text-white' : ''} flex items-center`}
            onClick={() => setFilter('pro')}
          >
            <BadgePercent size={14} className="mr-1" />
            Pro
          </button>
          <button
            className={`gr-btn gr-btn-outline ${filter === 'enterprise' ? 'active bg-gray-600 text-white' : ''} flex items-center`}
            onClick={() => setFilter('enterprise')}
          >
            <Settings size={14} className="mr-1" />
            Enterprise
          </button>
        </div>
      </div>

      {/* Tableau des réservations */}
      <div className="gr-reservations-container bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="gr-reservations-header p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="gr-reservations-count text-gray-600">
            {filteredReservations.length}{' '}
            {filteredReservations.length === 1 ? 'réservation trouvée' : 'réservations trouvées'}
          </div>
        </div>
        {filteredReservations.length > 0 ? (
          <div className="gr-table-responsive overflow-x-auto">
            <table className="gr-reservations-table w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Durée</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fonctionnalités</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut/Paiement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id_reservation} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`gr-badge ${getBadgeClass(reservation.formule)} inline-flex items-center`}>
                        {reservation.formule === 'Starter' && <BadgeCheck size={14} className="mr-1" />}
                        {reservation.formule === 'Pro' && <BadgePercent size={14} className="mr-1" />}
                        {reservation.formule === 'Enterprise' && <Settings size={14} className="mr-1" />}
                        {reservation.formule || 'Non spécifié'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="font-medium text-gray-900">{reservation.nom_complet || '-'}</div>
                        <div className="text-sm text-gray-500">{reservation.entreprise || '-'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <a href={`mailto:${reservation.email}`} className="text-blue-600 hover:text-blue-800">
                          {reservation.email || '-'}
                        </a>
                        {reservation.telephone && (
                          <div className="text-sm text-gray-500 mt-1">{reservation.telephone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div>
                          {reservation.date ? 
                            new Date(reservation.date).toLocaleDateString('fr-FR') : '-'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.duree || '1 mois'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="gr-features-compact">
                        {reservation.fonctionnalite && reservation.fonctionnalite.length > 0 ? (
                          <>
                            <div className="gr-features-icons">
                              {reservation.fonctionnalite.slice(0, 3).map((feature, index) => (
                                <span key={index} className="gr-feature-icon" title={feature}>
                                  {getFeatureIcon(feature)}
                                </span>
                              ))}
                              {reservation.fonctionnalite.length > 3 && (
                                <span className="gr-feature-more" title={reservation.fonctionnalite.slice(3).join(', ')}>
                                  +{reservation.fonctionnalite.length - 3}
                                </span>
                              )}
                            </div>
                            <div className="gr-features-tooltip">
                              {reservation.fonctionnalite.map((feature, index) => (
                                <div key={index} className="gr-feature-item">
                                  {getFeatureIcon(feature)}
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <span className="gr-no-data text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {calculateTotal(reservation)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`gr-statut ${getStatutClass(reservation.statut)} px-2 py-1 rounded-full text-xs text-center`}>
                          {reservation.statut || 'en_attente'}
                        </span>
                        {reservation.paiement && (
                          <span className={`gr-paiement ${getPaiementClass(reservation.paiement)} px-2 py-1 rounded-full text-xs text-center`}>
                            {reservation.paiement}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="gr-action-buttons flex space-x-2">
                        <button
                          className="gr-btn gr-btn-view text-blue-600 hover:text-blue-900"
                          onClick={() => viewReservation(reservation)}
                          title="Voir les détails"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="gr-btn gr-btn-delete text-red-600 hover:text-red-900"
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
          <div className="gr-empty-state p-8 text-center">
            <div className="gr-empty-state-icon mx-auto mb-4 text-gray-400">
              <Layers size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation trouvée</h3>
            <p className="text-gray-500 mb-6">Essayez de modifier vos critères de recherche ou ajoutez une nouvelle réservation</p>
            <button 
              className="gr-btn gr-btn-primary inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
        <div className="gr-modal-overlay active fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="gr-modal bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="gr-modal-header flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Plus size={20} className="mr-2 text-blue-500" />
                Nouvelle Réservation
              </h2>
              <button 
                className="gr-close-btn text-gray-400 hover:text-gray-500"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="gr-modal-body p-6">
              <div className="gr-form-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="gr-form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Tag size={16} className="mr-2 text-blue-500" />
                    Formule *
                  </label>
                  <select
                    name="formule"
                    value={newReservation.formule}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                  >
                    <option value="">Sélectionnez une formule</option>
                    <option value="Starter">Starter</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="gr-form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <DollarSign size={16} className="mr-2 text-blue-500" />
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
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                  />
                </div>
                <div className="gr-form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <DollarSign size={16} className="mr-2 text-blue-500" />
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
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                  />
                </div>
                <div className="gr-form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <User size={16} className="mr-2 text-blue-500" />
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="nom_complet"
                    value={newReservation.nom_complet}
                    onChange={handleInputChange}
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                  />
                </div>
                <div className="gr-form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Briefcase size={16} className="mr-2 text-blue-500" />
                    Entreprise *
                  </label>
                  <input
                    type="text"
                    name="entreprise"
                    value={newReservation.entreprise}
                    onChange={handleInputChange}
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                  />
                </div>
                <div className="gr-form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Mail size={16} className="mr-2 text-blue-500" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newReservation.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                  />
                </div>
                <div className="gr-form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Smartphone size={16} className="mr-2 text-blue-500" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={newReservation.telephone}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                  />
                </div>
                <div className="gr-form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Calendar size={16} className="mr-2 text-blue-500" />
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={newReservation.date}
                    onChange={handleInputChange}
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                  />
                </div>
                <div className="gr-form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Clock size={16} className="mr-2 text-blue-500" />
                    Durée *
                  </label>
                  <select
                    name="duree"
                    value={newReservation.duree}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                  >
                    {dureeOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="gr-form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <CreditCard size={16} className="mr-2 text-blue-500" />
                    Paiement *
                  </label>
                  <select
                    name="paiement"
                    value={newReservation.paiement}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                  >
                    {paiementOptions.map((option) => (
                      <option key={option} value={option}>
                        {option === 'non_paye' ? 'Non payé' : 
                         option === 'partiel' ? 'Partiel' : 'Payé'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="gr-form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <CheckCircle size={16} className="mr-2 text-blue-500" />
                    Statut *
                  </label>
                  <select
                    name="statut"
                    value={newReservation.statut}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                  >
                    {statutOptions.map((option) => (
                      <option key={option} value={option}>
                        {option === 'en_attente' ? 'En attente' : 
                         option === 'en_cours' ? 'En cours' : 
                         option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="gr-form-group mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes supplémentaires</label>
                <textarea
                  name="notes"
                  value={newReservation.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                />
              </div>
              
              <div className="gr-form-group mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Types de Personnalisation</label>
                <div className="gr-multiselect relative">
                  <div
                    className="gr-multiselect-input flex flex-wrap items-center p-2 border border-gray-300 rounded-md cursor-text"
                    onClick={() => setShowCustomizationsDropdown(!showCustomizationsDropdown)}
                  >
                    {newReservation.type_perso.map((type) => (
                      <span key={type} className="gr-tag bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full m-1 flex items-center">
                        {type}
                        <span
                          className="gr-tag-remove ml-1 cursor-pointer hover:text-blue-600"
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
                      className="flex-grow min-w-[200px] p-1 border-none focus:outline-none"
                    />
                    <button 
                      className="gr-dropdown-toggle ml-2 text-gray-500 hover:text-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCustomizationsDropdown(!showCustomizationsDropdown);
                      }}
                    >
                      {showCustomizationsDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                  {showCustomizationsDropdown && (
                    <div className="gr-multiselect-options active absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {customizationsOptions
                        .filter(
                          (option) =>
                            option.toLowerCase().includes(currentCustomization.toLowerCase()) &&
                            !newReservation.type_perso.includes(option)
                        )
                        .map((option) => (
                          <div
                            key={option}
                            className="gr-multiselect-option p-2 hover:bg-blue-50 cursor-pointer flex items-center"
                            onClick={() => handleCustomizationSelect(option)}
                          >
                            <Circle size={8} className="mr-2 text-blue-500" />
                            {option}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="gr-form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fonctionnalités Incluses</label>
                <div className="gr-multiselect relative">
                  <div
                    className="gr-multiselect-input flex flex-wrap items-center p-2 border border-gray-300 rounded-md cursor-text"
                    onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                  >
                    {newReservation.fonctionnalite.map((feature) => (
                      <span key={feature} className="gr-tag bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full m-1 flex items-center">
                        {featuresOptions.find(f => f.name === feature)?.icon || <Check size={12} />}
                        <span className="ml-1">{feature}</span>
                        <span
                          className="gr-tag-remove ml-1 cursor-pointer hover:text-green-600"
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
                      className="flex-grow min-w-[200px] p-1 border-none focus:outline-none"
                    />
                    <button 
                      className="gr-dropdown-toggle ml-2 text-gray-500 hover:text-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFeaturesDropdown(!showFeaturesDropdown);
                      }}
                    >
                      {showFeaturesDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                  {showFeaturesDropdown && (
                    <div className="gr-multiselect-options active absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {featuresOptions
                        .filter(
                          (option) =>
                            option.name.toLowerCase().includes(currentFeature.toLowerCase()) &&
                            !newReservation.fonctionnalite.includes(option.name)
                        )
                        .map((option) => (
                          <div
                            key={option.name}
                            className="gr-multiselect-option p-2 hover:bg-green-50 cursor-pointer flex items-center"
                            onClick={() => handleFeatureSelect(option.name)}
                          >
                            {option.icon}
                            <span className="ml-2">{option.name}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="gr-form-footer p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                className="gr-btn gr-btn-outline px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                onClick={() => setShowModal(false)}
              >
                <X size={16} className="mr-2" />
                Annuler
              </button>
              <button
                className="gr-btn gr-btn-primary px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                onClick={handleAddReservation}
                disabled={
                  !newReservation.formule ||
                  !newReservation.prix ||
                  !newReservation.prix_perso ||
                  !newReservation.nom_complet ||
                  !newReservation.entreprise ||
                  !newReservation.email ||
                  !newReservation.date ||
                  !newReservation.statut ||
                  !newReservation.duree ||
                  !newReservation.paiement
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
        <div className="gr-modal-overlay active fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="gr-modal bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="gr-modal-header flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                {isEditing ? (
                  <Edit size={20} className="mr-2 text-blue-500" />
                ) : (
                  <Eye size={20} className="mr-2 text-blue-500" />
                )}
                Détails de la Réservation
              </h2>
              <button 
                className="gr-close-btn text-gray-400 hover:text-gray-500"
                onClick={() => setShowViewModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="gr-modal-body p-6">
              <div className="gr-invoice-container bg-white p-8 rounded-lg" id="invoice-print">
                <div className="gr-invoice-header flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                  <div>
                    <div className="gr-invoice-title text-2xl font-bold text-gray-800">Facture</div>
                    <div className="gr-invoice-number text-sm text-gray-500 mt-1">
                      Réservation #{currentReservation.id_reservation}
                    </div>
                    <div className="gr-invoice-date text-sm text-gray-500 mt-1">
                      Date: {currentReservation.date ? 
                        new Date(currentReservation.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : '-'}
                    </div>
                  </div>
                  <div className="gr-invoice-logo text-xl font-bold text-blue-500 flex items-center">
                    <span className="w-6 h-6 bg-blue-500 rounded-full mr-2"></span>
                    B2B Réservations
                  </div>
                </div>
                <div className="gr-invoice-details flex flex-col md:flex-row gap-6 mb-8">
                  <div className="gr-invoice-section bg-gray-50 p-4 rounded-lg flex-1">
                    <h3 className="text-lg font-semibold text-blue-500 border-b border-blue-200 pb-2 mb-4">
                      Client
                    </h3>
                    {isEditing ? (
                      <>
                        <div className="gr-form-group mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                          <input
                            type="text"
                            name="nom_complet"
                            value={currentReservation.nom_complet}
                            onChange={handleEditInputChange}
                            className="gr-edit-input w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="gr-form-group mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                          <input
                            type="text"
                            name="entreprise"
                            value={currentReservation.entreprise}
                            onChange={handleEditInputChange}
                            className="gr-edit-input w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="gr-form-group mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={currentReservation.email}
                            onChange={handleEditInputChange}
                            className="gr-edit-input w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="gr-form-group mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                          <input
                            type="tel"
                            name="telephone"
                            value={currentReservation.telephone}
                            onChange={handleEditInputChange}
                            className="gr-edit-input w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="gr-form-group">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                          <select
                            name="statut"
                            value={currentReservation.statut}
                            onChange={handleEditInputChange}
                            className="gr-edit-input w-full p-2 border border-gray-300 rounded-md"
                          >
                            {statutOptions.map((option) => (
                              <option key={option} value={option}>
                                {option === 'en_attente' ? 'En attente' : 
                                 option === 'en_cours' ? 'En cours' : 
                                 option.charAt(0).toUpperCase() + option.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="mb-2"><strong className="text-gray-700">Nom:</strong> {currentReservation.nom_complet || '-'}</p>
                        <p className="mb-2"><strong className="text-gray-700">Entreprise:</strong> {currentReservation.entreprise || '-'}</p>
                        <p className="mb-2"><strong className="text-gray-700">Email:</strong> {currentReservation.email || '-'}</p>
                        {currentReservation.telephone && (
                          <p className="mb-2"><strong className="text-gray-700">Téléphone:</strong> {currentReservation.telephone}</p>
                        )}
                        <p><strong className="text-gray-700">Statut:</strong> 
                          <span className={`gr-statut ${getStatutClass(currentReservation.statut)} ml-2 px-2 py-1 rounded-full text-xs`}>
                            {currentReservation.statut === 'en_attente' ? 'En attente' : 
                             currentReservation.statut === 'en_cours' ? 'En cours' : 
                             currentReservation.statut || 'en_attente'}
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                  <div className="gr-invoice-section bg-gray-50 p-4 rounded-lg flex-1">
                    <h3 className="text-lg font-semibold text-blue-500 border-b border-blue-200 pb-2 mb-4">
                      Réservation
                    </h3>
                    {isEditing ? (
                      <>
                        <div className="gr-form-group mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Formule</label>
                          <select
                            name="formule"
                            value={currentReservation.formule}
                            onChange={handleEditInputChange}
                            className="gr-edit-input w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="Starter">Starter</option>
                            <option value="Pro">Pro</option>
                            <option value="Enterprise">Enterprise</option>
                          </select>
                        </div>
                        <div className="gr-form-group mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            name="date"
                            value={currentReservation.date}
                            onChange={handleEditInputChange}
                            className="gr-edit-input w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="gr-form-group mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
                          <select
                            name="duree"
                            value={currentReservation.duree}
                            onChange={handleEditInputChange}
                            className="gr-edit-input w-full p-2 border border-gray-300 rounded-md"
                          >
                            {dureeOptions.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                        <div className="gr-form-group">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Paiement</label>
                          <select
                            name="paiement"
                            value={currentReservation.paiement}
                            onChange={handleEditInputChange}
                            className="gr-edit-input w-full p-2 border border-gray-300 rounded-md"
                          >
                            {paiementOptions.map((option) => (
                              <option key={option} value={option}>
                                {option === 'non_paye' ? 'Non payé' : 
                                 option === 'partiel' ? 'Partiel' : 'Payé'}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="mb-2">
                          <strong className="text-gray-700">Formule:</strong> 
                          <span className={`gr-badge ${getBadgeClass(currentReservation.formule)} ml-2`}>
                            {currentReservation.formule || '-'}
                          </span>
                        </p>
                        <p className="mb-2">
                          <strong className="text-gray-700">Date:</strong> {currentReservation.date ? 
                            new Date(currentReservation.date).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : '-'}
                        </p>
                        <p className="mb-2">
                          <strong className="text-gray-700">Durée:</strong> {currentReservation.duree || '1 mois'}
                        </p>
                        <p>
                          <strong className="text-gray-700">Paiement:</strong> 
                          <span className={`gr-paiement ${getPaiementClass(currentReservation.paiement)} ml-2 px-2 py-1 rounded-full text-xs`}>
                            {currentReservation.paiement === 'non_paye' ? 'Non payé' : 
                             currentReservation.paiement === 'partiel' ? 'Partiel' : 
                             currentReservation.paiement || 'Non payé'}
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                </div>
                
                {currentReservation.notes && (
                  <div className="gr-invoice-notes bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold text-blue-500 border-b border-blue-200 pb-2 mb-4">
                      Notes
                    </h3>
                    {isEditing ? (
                      <textarea
                        name="notes"
                        value={currentReservation.notes}
                        onChange={handleEditInputChange}
                        rows={3}
                        className="gr-edit-input w-full p-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="whitespace-pre-line">{currentReservation.notes}</p>
                    )}
                  </div>
                )}
                
                <div className="gr-invoice-personnalisation bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-blue-500 border-b border-blue-200 pb-2 mb-4">
                    Types de Personnalisation
                  </h3>
                  {isEditing ? (
                    <div className="gr-multiselect relative">
                      <div className="gr-multiselect-input flex flex-wrap items-center p-2 border border-gray-300 rounded-md cursor-text">
                        {currentReservation.type_perso.map((type) => (
                          <span key={type} className="gr-tag bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full m-1 flex items-center">
                            {type}
                            <span
                              className="gr-tag-remove ml-1 cursor-pointer hover:text-blue-600"
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
                          className="flex-grow min-w-[200px] p-1 border-none focus:outline-none"
                        />
                        <button 
                          className="gr-dropdown-toggle ml-2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowCustomizationsDropdown(!showCustomizationsDropdown)}
                        >
                          {showCustomizationsDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                      {showCustomizationsDropdown && (
                        <div className="gr-multiselect-options active absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {customizationsOptions
                            .filter(option => !currentReservation.type_perso.includes(option))
                            .map((option) => (
                              <div
                                key={option}
                                className="gr-multiselect-option p-2 hover:bg-blue-50 cursor-pointer flex items-center"
                                onClick={() => {
                                  setCurrentReservation(prev => ({
                                    ...prev,
                                    type_perso: [...prev.type_perso, option]
                                  }));
                                  setShowCustomizationsDropdown(false);
                                }}
                              >
                                <Circle size={8} className="mr-2 text-blue-500" />
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
                          <li key={idx} className="flex items-center py-2">
                            <Circle size={8} className="mr-2 text-blue-500" />
                            {type}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 py-2">Aucune personnalisation</li>
                      )}
                    </ul>
                  )}
                </div>
                <div className="gr-invoice-features bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-blue-500 border-b border-blue-200 pb-2 mb-4">
                    Fonctionnalités Incluses
                  </h3>
                  {isEditing ? (
                    <div className="gr-multiselect relative">
                      <div className="gr-multiselect-input flex flex-wrap items-center p-2 border border-gray-300 rounded-md cursor-text">
                        {currentReservation.fonctionnalite.map((feature) => (
                          <span key={feature} className="gr-tag bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full m-1 flex items-center">
                            {featuresOptions.find(f => f.name === feature)?.icon || <Check size={12} />}
                            <span className="ml-1">{feature}</span>
                            <span
                              className="gr-tag-remove ml-1 cursor-pointer hover:text-green-600"
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
                          className="flex-grow min-w-[200px] p-1 border-none focus:outline-none"
                        />
                        <button 
                          className="gr-dropdown-toggle ml-2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                        >
                          {showFeaturesDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                      {showFeaturesDropdown && (
                        <div className="gr-multiselect-options active absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {featuresOptions
                            .filter(option => !currentReservation.fonctionnalite.includes(option.name))
                            .map((option) => (
                              <div
                                key={option.name}
                                className="gr-multiselect-option p-2 hover:bg-green-50 cursor-pointer flex items-center"
                                onClick={() => {
                                  setCurrentReservation(prev => ({
                                    ...prev,
                                    fonctionnalite: [...prev.fonctionnalite, option.name]
                                  }));
                                  setShowFeaturesDropdown(false);
                                }}
                              >
                                {option.icon}
                                <span className="ml-2">{option.name}</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <ul>
                      {currentReservation.fonctionnalite && currentReservation.fonctionnalite.length > 0 ? (
                        currentReservation.fonctionnalite.map((feature, idx) => (
                          <li key={idx} className="flex items-center py-2">
                            {featuresOptions.find(f => f.name === feature)?.icon || <Check size={12} />}
                            <span className="ml-2">{feature}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 py-2">Aucune fonctionnalité supplémentaire</li>
                      )}
                    </ul>
                  )}
                </div>
                <div className="gr-invoice-total bg-gradient-to-r from-blue-500 to-gray-800 p-6 rounded-lg mb-6 text-white">
                  <h3 className="text-xl font-semibold border-b border-white border-opacity-20 pb-2 mb-4">
                    Détail du prix
                  </h3>
                  {isEditing ? (
                    <>
                      <div className="gr-price-edit mb-3">
                        <label className="block mb-1">Prix de base:</label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            name="prix"
                            value={currentReservation.prix}
                            onChange={handleEditInputChange}
                            min="0"
                            step="0.01"
                            className="w-full p-2 border border-gray-300 rounded-md text-gray-800"
                          />
                          <span className="ml-2">€</span>
                        </div>
                      </div>
                      <div className="gr-price-edit">
                        <label className="block mb-1">Prix personnalisation:</label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            name="prix_perso"
                            value={currentReservation.prix_perso}
                            onChange={handleEditInputChange}
                            min="0"
                            step="0.01"
                            className="w-full p-2 border border-gray-300 rounded-md text-gray-800"
                          />
                          <span className="ml-2">€</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="gr-price-row mb-2">
                        <span className="gr-price-label">Prix de base:</span>
                        <span className="gr-price-value">{currentReservation.prix || '0'} €</span>
                      </div>
                      <div className="gr-price-row mb-2">
                        <span className="gr-price-label">Prix personnalisation:</span>
                        <span className="gr-price-value">{currentReservation.prix_perso || '0'} €</span>
                      </div>
                    </>
                  )}
                  <div className="gr-price-row gr-total-amount mt-4 text-xl font-bold">
                    <span>Total:</span>
                    <span>{calculateTotal(currentReservation)} €</span>
                  </div>
                </div>
                <div className="gr-invoice-footer text-center text-gray-500 text-sm pt-4 border-t border-gray-200">
                  <p>Merci pour votre confiance !</p>
                  <p>B2B Réservations - contact@b2b-reservations.com</p>
                </div>
              </div>
            </div>
            <div className="gr-form-footer p-4 border-t border-gray-200 flex justify-end space-x-3">
              {!isEditing ? (
                <>
                  <button
                    className="gr-btn gr-btn-outline px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center no-print"
                    onClick={() => setShowViewModal(false)}
                  >
                    <X size={16} className="mr-2" />
                    Fermer
                  </button>
                  <button 
                    className="gr-btn gr-btn-primary px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center no-print"
                    onClick={printInvoice}
                  >
                    <Printer size={16} className="mr-2" />
                    Imprimer
                  </button>
                  <button
                    className="gr-btn gr-btn-success px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center no-print"
                    onClick={enableEditing}
                  >
                    <Edit size={16} className="mr-2" />
                    Modifier
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="gr-btn gr-btn-outline px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center no-print"
                    onClick={() => setIsEditing(false)}
                  >
                    <X size={16} className="mr-2" />
                    Annuler
                  </button>
                  <button
                    className="gr-btn gr-btn-success px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center no-print"
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
  );
};

export default GestionReservation;