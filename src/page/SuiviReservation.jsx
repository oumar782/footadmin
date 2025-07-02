import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Printer, CheckCircle, XCircle, Plus, X, ChevronDown, ChevronUp, 
  Edit, Trash2, Eye, Calendar, User, Briefcase, Mail, Tag, 
  Layers, DollarSign, Search, Filter, BadgeCheck, BadgePercent,
  Settings, CreditCard, ArrowRight, Circle, Check, BarChart2, PieChart, Activity
} from 'lucide-react';
import './suivireservation.css';

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
    statut: 'en_attente',
    date: new Date().toISOString().split('T')[0]
  });

  const [currentFeature, setCurrentFeature] = useState('');
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [currentCustomization, setCurrentCustomization] = useState('');
  const [showCustomizationsDropdown, setShowCustomizationsDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Options
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

  // Formules avec prix par défaut
  const formules = {
    Starter: { prix: 99, features: ['Jusqua 2 terrains', 'Réservations en ligne', 'Paiements intégrés', 'Tableau de bord basique', 'Support par email'] },
    Pro: { prix: 179, features: ['Jusquà 5 terrains', 'Réservations en ligne', 'Paiements intégrés', 'Tableau de bord avancé', 'Statistiques détaillées', 'Application mobile', 'Personnalisation avancée', 'Support prioritaire'] },
    Enterprise: { prix: 349, features: ['Terrains illimités', 'Réservations en ligne', 'Paiements intégrés', 'Tableau de bord premium', 'Statistiques avancées', 'Application mobile personnalisée', 'Personnalisation complète', 'API dédiée', 'Support 24/7', 'Gestionnaire de compte dédié'] }
  };

  // Statistiques
  const [stats, setStats] = useState({
    totalReservations: 0,
    totalCA: 0,
    starterCount: 0,
    proCount: 0,
    enterpriseCount: 0,
    signedCount: 0,
    lostCount: 0,
    pendingCount: 0,
    caSigned: 0,
    caLost: 0,
    caPending: 0
  });

  // Calcul des statistiques
  const calculateStats = (data) => {
    const stats = {
      totalReservations: data.length,
      totalCA: 0,
      starterCount: 0,
      proCount: 0,
      enterpriseCount: 0,
      signedCount: 0,
      lostCount: 0,
      pendingCount: 0,
      caSigned: 0,
      caLost: 0,
      caPending: 0
    };

    data.forEach(res => {
      const total = (parseFloat(res.prix) || 0) + (parseFloat(res.prix_perso) || 0);
      stats.totalCA += total;

      if (res.formule === 'Starter') stats.starterCount++;
      if (res.formule === 'Pro') stats.proCount++;
      if (res.formule === 'Enterprise') stats.enterpriseCount++;

      if (res.statut === 'signé') {
        stats.signedCount++;
        stats.caSigned += total;
      } else if (res.statut === 'perdu') {
        stats.lostCount++;
        stats.caLost += total;
      } else {
        stats.pendingCount++;
        stats.caPending += total;
      }
    });

    return stats;
  };

  // Charger les réservations depuis l'API
  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/reservations/');
      const data = await response.json();
      if (data.success) {
        const formattedData = data.data.map(res => ({
          ...res,
          type_perso: formatArrayData(res.type_perso),
          fonctionnalite: formatArrayData(res.fonctionnalite)
        }));
        setReservations(formattedData);
        setFilteredReservations(formattedData);
        setStats(calculateStats(formattedData));
        toast.success('Réservations chargées avec succès');
      } else {
        toast.error('Erreur lors du chargement des réservations');
      }
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      toast.error('Erreur lors du chargement des réservations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
          (r.fonctionnalite && r.fonctionnalite.some((f) => f && f.toLowerCase().includes(term))) ||
          (r.type_perso && r.type_perso.some((t) => t && t.toLowerCase().includes(term))) ||
          (r.statut && r.statut.toLowerCase().includes(term))
      );
    }
    setFilteredReservations(results);
    setStats(calculateStats(results));
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

      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/reservations/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...newReservation,
          type_perso: newReservation.type_perso,
          fonctionnalite: newReservation.fonctionnalite
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const newRes = {
          ...data.data,
          type_perso: formatArrayData(data.data.type_perso),
          fonctionnalite: formatArrayData(data.data.fonctionnalite)
        };
        setReservations([...reservations, newRes]);
        setStats(calculateStats([...reservations, newRes]));
        resetForm();
        setShowModal(false);
        toast.success('Réservation ajoutée avec succès');
      } else {
        toast.error(data.message || 'Erreur lors de l\'ajout de la réservation');
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      toast.error('Erreur lors de l\'ajout de la réservation');
    } finally {
      setIsLoading(false);
    }
  };

  // Modifier une réservation via l'API
  const handleUpdateReservation = async () => {
    try {
      if (!currentReservation || !currentReservation.id_reservation) {
        toast.error('Aucune réservation sélectionnée');
        return;
      }

      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/reservations/${currentReservation.id_reservation}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
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
        setStats(calculateStats(updatedReservations));
        setShowViewModal(false);
        setIsEditing(false);
        toast.success('Réservation mise à jour avec succès');
      } else {
        toast.error(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de la réservation');
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer une réservation via l'API
  const handleDeleteReservation = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) return;

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        const updatedReservations = reservations.filter((r) => r.id_reservation !== id);
        setReservations(updatedReservations);
        setStats(calculateStats(updatedReservations));
        toast.success('Réservation supprimée avec succès');
      } else {
        toast.error(data.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error('Erreur lors de la suppression de la réservation');
    } finally {
      setIsLoading(false);
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
      date: new Date().toISOString().split('T')[0],
      statut: 'en_attente'
    });
  };

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReservation((prev) => ({
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
    if (!formule) return 'res-badge-basic';
    switch (formule.toLowerCase()) {
      case 'starter':
        return 'res-badge-starter';
      case 'pro':
        return 'res-badge-pro';
      case 'enterprise':
        return 'res-badge-enterprise';
      default:
        return 'res-badge-basic';
    }
  };

  // Classes CSS pour les statuts
  const getStatutClass = (statut) => {
    switch (statut) {
      case 'signé':
        return 'res-status-signed';
      case 'perdu':
        return 'res-status-lost';
      case 'en_attente':
        return 'res-status-pending';
      default:
        return 'res-status-pending';
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
    const printContent = document.getElementById('invoice-print');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Facture Réservation #${currentReservation.id_reservation}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
            
            body { 
              font-family: 'Montserrat', sans-serif; 
              color: #333; 
              background-color: #fff;
              margin: 0;
              padding: 0;
            }
            
            .invoice-container { 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 40px;
              background: white;
              box-shadow: 0 0 20px rgba(0,0,0,0.05);
            }
            
            .invoice-header { 
              display: flex; 
              justify-content: space-between; 
              align-items: center;
              margin-bottom: 40px; 
              padding-bottom: 20px;
              border-bottom: 1px solid #eee;
            }
            
            .invoice-title { 
              font-size: 28px; 
              font-weight: 700; 
              color: #3a0ca3; 
              margin: 0;
            }
            
            .invoice-logo { 
              font-size: 24px; 
              font-weight: 700; 
              color: #4361ee;
              display: flex;
              align-items: center;
            }
            
            .invoice-logo:before {
              content: "";
              display: inline-block;
              width: 30px;
              height: 30px;
              background-color: #4361ee;
              border-radius: 50%;
              margin-right: 10px;
            }
            
            .invoice-details { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 40px;
              gap: 30px;
            }
            
            .invoice-section { 
              flex: 1;
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
            }
            
            .invoice-section h3 { 
              border-bottom: 2px solid #e9ecef; 
              padding-bottom: 10px; 
              color: #3a0ca3;
              font-size: 18px;
              font-weight: bold;
              margin-top: 0;
              margin-bottom: 15px;
            }
            
            .invoice-features, 
            .invoice-personnalisation { 
              margin-bottom: 30px;
              background: #f9f9f9;
              padding: 20px;
              border-radius: 8px;
            }
            
            .invoice-features h3, 
            .invoice-personnalisation h3 { 
              border-bottom: 2px solid #e9ecef; 
              padding-bottom: 10px; 
              color: #3a0ca3;
              font-size: 18px;
              font-weight: 600;
              margin-top: 0;
              margin-bottom: 15px;
            }
            
            ul { 
              list-style-type: none; 
              padding-left: 0;
              margin: 0;
              color: #495057;
            }
            
            li { 
              padding: 8px 0;
              border-bottom: 1px solid #eee;
              display: flex;
              align-items: center;
              color: #212529;
            }
            
            li:last-child {
              border-bottom: none;
            }
            
            li:before {
              content: "•";
              color: #4361ee;
              font-weight: bold;
              display: inline-block;
              width: 1em;
              margin-right: 10px;
            }
            
            .invoice-total { 
              background: linear-gradient(135deg, #4361ee, #3a0ca3);
              padding: 25px;
              border-radius: 8px;
              color: white;
              margin-bottom: 30px;
            }
            
            .invoice-total h3 {
              color: white;
              margin-top: 0;
              font-size: 20px;
              border-bottom: 2px solid rgba(255,255,255,0.2);
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            
            .total-amount { 
              font-size: 24px; 
              font-weight: 700; 
              color: white;
              text-align: right;
              margin-top: 15px;
            }
            
            .invoice-footer { 
              margin-top: 40px; 
              text-align: center; 
              color: #6c757d; 
              font-size: 14px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            
            .res-badge { 
              padding: 5px 12px; 
              border-radius: 20px; 
              font-size: 12px; 
              font-weight: 600;
              display: inline-block;
              margin-left: 10px;
            }
            
            .res-badge-starter { 
              background: linear-gradient(135deg, #4895ef, #4361ee);
              color: white; 
            }
            
            .res-badge-pro { 
              background: linear-gradient(135deg, #3f37c9, #3a0ca3);
              color: white; 
            }
            
            .res-badge-enterprise { 
              background: linear-gradient(135deg, #7209b7, #560bad);
              color: white; 
            }
            
            .res-status-signed {
              background-color: #4cc9f0;
              color: white;
            }
            
            .res-status-lost {
              background-color: #ef233c;
              color: white;
            }
            
            .res-status-pending {
              background-color: #f8961e;
              color: white;
            }
            
            .price-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              color: white;
            }
            
            .price-label {
              font-weight: bold;
              color: rgba(255,255,255,0.9);
            }
            
            .price-value {
              font-weight: 600;
              color: white;
            }
            
            .invoice-number {
              font-size: 14px;
              color: #6c757d;
              margin-top: 5px;
            }
            
            .invoice-date {
              font-size: 14px;
              color: #6c757d;
              margin-top: 5px;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  // Gestion des fonctionnalités incluses
  const handleAddFeature = () => {
    if (currentFeature && !newReservation.fonctionnalite.includes(currentFeature)) {
      setNewReservation((prev) => ({
        ...prev,
        fonctionnalite: [...prev.fonctionnalite, currentFeature]
      }));
      setCurrentFeature('');
    }
  };

  const handleRemoveFeature = (feature) => {
    setNewReservation((prev) => ({
      ...prev,
      fonctionnalite: prev.fonctionnalite.filter((f) => f !== feature)
    }));
  };

  const handleFeatureSelect = (feature) => {
    if (!newReservation.fonctionnalite.includes(feature)) {
      setNewReservation((prev) => ({
        ...prev,
        fonctionnalite: [...prev.fonctionnalite, feature]
      }));
    }
    setShowFeaturesDropdown(false);
  };

  // Gestion des types de personnalisation
  const handleAddCustomizationType = () => {
    if (currentCustomization && !newReservation.type_perso.includes(currentCustomization)) {
      setNewReservation((prev) => ({
        ...prev,
        type_perso: [...prev.type_perso, currentCustomization]
      }));
      setCurrentCustomization('');
    }
  };

  const handleRemoveCustomizationType = (type) => {
    setNewReservation((prev) => ({
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

  // Formatage monétaire
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <div className="res-container">
      {/* En-tête */}
      <header className="res-header">
        <div className="res-title">
          <div className="res-icon">
            <Layers size={24} className="text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Réservations</h1>
        </div>
        <button 
          className="res-btn res-btn-primary flex items-center" 
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="res-spinner"></span>
          ) : (
            <>
              <Plus size={16} className="mr-2" />
              Nouvelle Réservation
            </>
          )}
        </button>
      </header>

      {/* Tableau de bord statistiques */}
      <div className="res-dashboard">
        <div className="res-stat-card res-stat-total">
          <div className="res-stat-icon">
            <Activity size={24} />
          </div>
          <div className="res-stat-info">
            <h3>Total Réservations</h3>
            <p>{stats.totalReservations}</p>
          </div>
        </div>
        
        <div className="res-stat-card res-stat-ca">
          <div className="res-stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="res-stat-info">
            <h3>Chiffre d'Affaires</h3>
            <p>{formatMoney(stats.totalCA)}</p>
          </div>
        </div>
        
        <div className="res-stat-card res-stat-formules">
          <div className="res-stat-icon">
            <BarChart2 size={24} />
          </div>
          <div className="res-stat-info">
            <h3>Répartition Formules</h3>
            <div className="res-stat-details">
              <span className="res-stat-badge res-starter">Starter: {stats.starterCount}</span>
              <span className="res-stat-badge res-pro">Pro: {stats.proCount}</span>
              <span className="res-stat-badge res-enterprise">Enterprise: {stats.enterpriseCount}</span>
            </div>
          </div>
        </div>
        
        <div className="res-stat-card res-stat-status">
          <div className="res-stat-icon">
            <PieChart size={24} />
          </div>
          <div className="res-stat-info">
            <h3>Statut des Réservations</h3>
            <div className="res-stat-details">
              <span className="res-stat-badge res-signed">Signé: {stats.signedCount}</span>
              <span className="res-stat-badge res-lost">Perdu: {stats.lostCount}</span>
              <span className="res-stat-badge res-pending">En attente: {stats.pendingCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="res-search-filter">
        <div className="res-search-box">
          <input
            type="text"
            placeholder="Rechercher des réservations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="res-search-input"
            disabled={isLoading}
          />
          <Search size={16} className="res-search-icon" />
        </div>
        <div className="res-filter-buttons">
          <button
            className={`res-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            disabled={isLoading}
          >
            <Filter size={14} className="mr-1" />
            Toutes
          </button>
          <button
            className={`res-filter-btn ${filter === 'starter' ? 'active' : ''}`}
            onClick={() => setFilter('starter')}
            disabled={isLoading}
          >
            <BadgeCheck size={14} className="mr-1" />
            Starter
          </button>
          <button
            className={`res-filter-btn ${filter === 'pro' ? 'active' : ''}`}
            onClick={() => setFilter('pro')}
            disabled={isLoading}
          >
            <BadgePercent size={14} className="mr-1" />
            Pro
          </button>
          <button
            className={`res-filter-btn ${filter === 'enterprise' ? 'active' : ''}`}
            onClick={() => setFilter('enterprise')}
            disabled={isLoading}
          >
            <Settings size={14} className="mr-1" />
            Enterprise
          </button>
        </div>
      </div>

      {/* Tableau des réservations */}
      <div className="res-table-container">
        <div className="res-table-header">
          <div className="res-count">
            {filteredReservations.length}{' '}
            {filteredReservations.length === 1 ? 'réservation trouvée' : 'réservations trouvées'}
          </div>
        </div>
        {isLoading ? (
          <div className="res-loading">
            <div className="res-spinner"></div>
            <p>Chargement des réservations...</p>
          </div>
        ) : filteredReservations.length > 0 ? (
          <div className="res-table-responsive">
            <table className="res-table">
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
                      <span className={`res-badge ${getBadgeClass(reservation.formule)}`}>
                        {reservation.formule === 'Starter' && <BadgeCheck size={14} className="mr-1" />}
                        {reservation.formule === 'Pro' && <BadgePercent size={14} className="mr-1" />}
                        {reservation.formule === 'Enterprise' && <Settings size={14} className="mr-1" />}
                        {reservation.formule || 'Non spécifié'}
                      </span>
                    </td>
                    <td>{formatMoney(reservation.prix || 0)}</td>
                    <td>{formatMoney(reservation.prix_perso || 0)}</td>
                    <td>
                      <div className="res-client-info">
                        <User size={16} className="res-icon-small" />
                        <span>{reservation.nom_complet || '-'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="res-client-info">
                        <Briefcase size={16} className="res-icon-small" />
                        <span>{reservation.entreprise || '-'}</span>
                      </div>
                    </td>
                    <td>
                      <a href={`mailto:${reservation.email}`} className="res-email">
                        <Mail size={16} className="res-icon-small" />
                        {reservation.email || '-'}
                      </a>
                    </td>
                    <td>
                      <div className="res-tags">
                        {reservation.type_perso && reservation.type_perso.length > 0 ? (
                          reservation.type_perso.map((type, index) => (
                            <span key={index} className="res-tag">
                              <Circle size={8} className="mr-1" />
                              {type}
                            </span>
                          ))
                        ) : (
                          <span className="res-no-data">-</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="res-tags">
                        {reservation.fonctionnalite && reservation.fonctionnalite.length > 0 ? (
                          reservation.fonctionnalite.map((feature, index) => (
                            <span key={index} className="res-tag res-feature-tag">
                              <Check size={8} className="mr-1" />
                              {feature}
                            </span>
                          ))
                        ) : (
                          <span className="res-no-data">-</span>
                        )}
                      </div>
                    </td>
                    <td className="res-total">{formatMoney(calculateTotal(reservation))}</td>
                    <td>
                      <span className={`res-status ${getStatutClass(reservation.statut)}`}>
                        {reservation.statut || 'en_attente'}
                      </span>
                    </td>
                    <td>
                      <div className="res-actions">
                        <button
                          className="res-action-btn res-view"
                          onClick={() => viewReservation(reservation)}
                          title="Voir les détails"
                          disabled={isLoading}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="res-action-btn res-delete"
                          onClick={() => handleDeleteReservation(reservation.id_reservation)}
                          title="Supprimer"
                          disabled={isLoading}
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
          <div className="res-empty-state">
            <div className="res-empty-icon">
              <Layers size={48} strokeWidth={1.5} />
            </div>
            <h3>Aucune réservation trouvée</h3>
            <p>Essayez de modifier vos critères de recherche ou ajoutez une nouvelle réservation</p>
            <button 
              className="res-btn res-btn-primary"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              disabled={isLoading}
            >
              <Plus size={16} className="mr-2" />
              Ajouter une réservation
            </button>
          </div>
        )}
      </div>

      {/* Modal d'ajout */}
      {showModal && (
        <div className="res-modal-overlay">
          <div className="res-modal">
            <div className="res-modal-header">
              <h2>
                <Plus size={20} className="mr-2" />
                Nouvelle Réservation
              </h2>
              <button 
                className="res-close-btn"
                onClick={() => setShowModal(false)}
                disabled={isLoading}
              >
                <X size={20} />
              </button>
            </div>
            <div className="res-modal-body">
              <div className="res-form-grid">
                <div className="res-form-group">
                  <label>
                    <Tag size={16} className="mr-2" />
                    Formule *
                  </label>
                  <select
                    name="formule"
                    value={newReservation.formule}
                    onChange={handleInputChange}
                    required
                    className="res-form-control"
                    disabled={isLoading}
                  >
                    <option value="">Sélectionnez une formule</option>
                    <option value="Starter">Starter</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="res-form-group">
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
                    className="res-form-control"
                    disabled={isLoading}
                  />
                </div>
                <div className="res-form-group">
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
                    className="res-form-control"
                    disabled={isLoading}
                  />
                </div>
                <div className="res-form-group">
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
                    className="res-form-control"
                    disabled={isLoading}
                  />
                </div>
                <div className="res-form-group">
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
                    className="res-form-control"
                    disabled={isLoading}
                  />
                </div>
                <div className="res-form-group">
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
                    className="res-form-control"
                    disabled={isLoading}
                  />
                </div>
                <div className="res-form-group">
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
                    className="res-form-control"
                    disabled={isLoading}
                  />
                </div>
                <div className="res-form-group">
                  <label>
                    <CheckCircle size={16} className="mr-2" />
                    Statut *
                  </label>
                  <select
                    name="statut"
                    value={newReservation.statut}
                    onChange={handleInputChange}
                    required
                    className="res-form-control"
                    disabled={isLoading}
                  >
                    <option value="en_attente">En attente</option>
                    <option value="signé">Signé</option>
                    <option value="perdu">Perdu</option>
                  </select>
                </div>
              </div>
              
              <div className="res-form-group">
                <label>Types de Personnalisation</label>
                <div className="res-multiselect">
                  <div
                    className="res-multiselect-input"
                    onClick={() => !isLoading && setShowCustomizationsDropdown(!showCustomizationsDropdown)}
                  >
                    {newReservation.type_perso.map((type) => (
                      <span key={type} className="res-tag">
                        {type}
                        <span
                          className="res-tag-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            !isLoading && handleRemoveCustomizationType(type);
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
                      onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleAddCustomizationType()}
                      onClick={(e) => {
                        e.stopPropagation();
                        !isLoading && setShowCustomizationsDropdown(true);
                      }}
                      className="res-multiselect-input-field"
                      disabled={isLoading}
                    />
                    <button 
                      className="res-dropdown-toggle"
                      onClick={(e) => {
                        e.stopPropagation();
                        !isLoading && setShowCustomizationsDropdown(!showCustomizationsDropdown);
                      }}
                      disabled={isLoading}
                    >
                      {showCustomizationsDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                  {showCustomizationsDropdown && (
                    <div className="res-multiselect-options">
                      {customizationsOptions
                        .filter(
                          (option) =>
                            option.toLowerCase().includes(currentCustomization.toLowerCase()) &&
                            !newReservation.type_perso.includes(option)
                        )
                        .map((option) => (
                          <div
                            key={option}
                            className="res-multiselect-option"
                            onClick={() => !isLoading && handleCustomizationSelect(option)}
                          >
                            <Circle size={8} className="mr-2" />
                            {option}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="res-form-group">
                <label>Fonctionnalités Incluses</label>
                <div className="res-multiselect">
                  <div
                    className="res-multiselect-input"
                    onClick={() => !isLoading && setShowFeaturesDropdown(!showFeaturesDropdown)}
                  >
                    {newReservation.fonctionnalite.map((feature) => (
                      <span key={feature} className="res-tag res-feature-tag">
                        {feature}
                        <span
                          className="res-tag-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            !isLoading && handleRemoveFeature(feature);
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
                      onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleAddFeature()}
                      onClick={(e) => {
                        e.stopPropagation();
                        !isLoading && setShowFeaturesDropdown(true);
                      }}
                      className="res-multiselect-input-field"
                      disabled={isLoading}
                    />
                    <button 
                      className="res-dropdown-toggle"
                      onClick={(e) => {
                        e.stopPropagation();
                        !isLoading && setShowFeaturesDropdown(!showFeaturesDropdown);
                      }}
                      disabled={isLoading}
                    >
                      {showFeaturesDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                  {showFeaturesDropdown && (
                    <div className="res-multiselect-options">
                      {featuresOptions
                        .filter(
                          (option) =>
                            option.toLowerCase().includes(currentFeature.toLowerCase()) &&
                            !newReservation.fonctionnalite.includes(option)
                        )
                        .map((option) => (
                          <div
                            key={option}
                            className="res-multiselect-option"
                            onClick={() => !isLoading && handleFeatureSelect(option)}
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
            <div className="res-modal-footer">
              <button 
                className="res-btn res-btn-outline"
                onClick={() => setShowModal(false)}
                disabled={isLoading}
              >
                <X size={16} className="mr-2" />
                Annuler
              </button>
              <button
                className="res-btn res-btn-primary"
                onClick={handleAddReservation}
                disabled={
                  isLoading ||
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
                {isLoading ? (
                  <span className="res-spinner"></span>
                ) : (
                  <>
                    <CheckCircle size={16} className="mr-2" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation / modification */}
      {showViewModal && currentReservation && (
        <div className="res-modal-overlay">
          <div className="res-modal res-view-modal">
            <div className="res-modal-header">
              <h2>
                {isEditing ? (
                  <Edit size={20} className="mr-2" />
                ) : (
                  <Eye size={20} className="mr-2" />
                )}
                Détails de la Réservation
              </h2>
              <button 
                className="res-close-btn"
                onClick={() => setShowViewModal(false)}
                disabled={isLoading}
              >
                <X size={20} />
              </button>
            </div>
            <div className="res-modal-body">
              <div className="res-invoice-container" id="invoice-print">
                <div className="res-invoice-header">
                  <div>
                    <div className="res-invoice-title">Facture</div>
                    <div className="res-invoice-number">
                      Réservation #{currentReservation.id_reservation}
                    </div>
                    <div className="res-invoice-date">
                      Date: {currentReservation.date ? 
                        new Date(currentReservation.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : '-'}
                    </div>
                  </div>
                  <div className="res-invoice-logo">
                    <span className="res-logo-icon"></span>
                    B2B Réservations
                  </div>
                </div>
                <div className="res-invoice-details">
                  <div className="res-invoice-section">
                    <h3>Client</h3>
                    {isEditing ? (
                      <>
                        <div className="res-form-group">
                          <label>Nom complet</label>
                          <input
                            type="text"
                            name="nom_complet"
                            value={currentReservation.nom_complet}
                            onChange={handleEditInputChange}
                            className="res-edit-input"
                            disabled={isLoading}
                          />
                        </div>
                        <div className="res-form-group">
                          <label>Entreprise</label>
                          <input
                            type="text"
                            name="entreprise"
                            value={currentReservation.entreprise}
                            onChange={handleEditInputChange}
                            className="res-edit-input"
                            disabled={isLoading}
                          />
                        </div>
                        <div className="res-form-group">
                          <label>Email</label>
                          <input
                            type="email"
                            name="email"
                            value={currentReservation.email}
                            onChange={handleEditInputChange}
                            className="res-edit-input"
                            disabled={isLoading}
                          />
                        </div>
                        <div className="res-form-group">
                          <label>Statut</label>
                          <select
                            name="statut"
                            value={currentReservation.statut}
                            onChange={handleEditInputChange}
                            className="res-edit-input"
                            disabled={isLoading}
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
                          <span className={`res-status ${getStatutClass(currentReservation.statut)}`}>
                            {currentReservation.statut || 'en_attente'}
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                  <div className="res-invoice-section">
                    <h3>Réservation</h3>
                    {isEditing ? (
                      <>
                        <div className="res-form-group">
                          <label>Formule</label>
                          <select
                            name="formule"
                            value={currentReservation.formule}
                            onChange={handleEditInputChange}
                            className="res-edit-input"
                            disabled={isLoading}
                          >
                            <option value="Starter">Starter</option>
                            <option value="Pro">Pro</option>
                            <option value="Enterprise">Enterprise</option>
                          </select>
                        </div>
                        <div className="res-form-group">
                          <label>Date</label>
                          <input
                            type="date"
                            name="date"
                            value={currentReservation.date}
                            onChange={handleEditInputChange}
                            className="res-edit-input"
                            disabled={isLoading}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>Formule:</strong> 
                          <span className={`res-badge ${getBadgeClass(currentReservation.formule)}`}>
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
                <div className="res-invoice-personnalisation">
                  <h3>Types de Personnalisation</h3>
                  {isEditing ? (
                    <div className="res-multiselect">
                      <div className="res-multiselect-input">
                        {currentReservation.type_perso.map((type) => (
                          <span key={type} className="res-tag">
                            {type}
                            <span
                              className="res-tag-remove"
                              onClick={() => {
                                if (!isLoading) {
                                  setCurrentReservation(prev => ({
                                    ...prev,
                                    type_perso: prev.type_perso.filter(t => t !== type)
                                  }));
                                }
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
                            if (!isLoading && e.key === 'Enter' && e.target.value) {
                              setCurrentReservation(prev => ({
                                ...prev,
                                type_perso: [...prev.type_perso, e.target.value]
                              }));
                              e.target.value = '';
                            }
                          }}
                          className="res-multiselect-input-field"
                          disabled={isLoading}
                        />
                        <button 
                          className="res-dropdown-toggle"
                          onClick={() => !isLoading && setShowCustomizationsDropdown(!showCustomizationsDropdown)}
                          disabled={isLoading}
                        >
                          {showCustomizationsDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                      {showCustomizationsDropdown && (
                        <div className="res-multiselect-options">
                          {customizationsOptions
                            .filter(option => !currentReservation.type_perso.includes(option))
                            .map((option) => (
                              <div
                                key={option}
                                className="res-multiselect-option"
                                onClick={() => {
                                  if (!isLoading) {
                                    setCurrentReservation(prev => ({
                                      ...prev,
                                      type_perso: [...prev.type_perso, option]
                                    }));
                                    setShowCustomizationsDropdown(false);
                                  }
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
                <div className="res-invoice-features">
                  <h3>Fonctionnalités Incluses</h3>
                  {isEditing ? (
                    <div className="res-multiselect">
                      <div className="res-multiselect-input">
                        {currentReservation.fonctionnalite.map((feature) => (
                          <span key={feature} className="res-tag res-feature-tag">
                            {feature}
                            <span
                              className="res-tag-remove"
                              onClick={() => {
                                if (!isLoading) {
                                  setCurrentReservation(prev => ({
                                    ...prev,
                                    fonctionnalite: prev.fonctionnalite.filter(f => f !== feature)
                                  }));
                                }
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
                            if (!isLoading && e.key === 'Enter' && e.target.value) {
                              setCurrentReservation(prev => ({
                                ...prev,
                                fonctionnalite: [...prev.fonctionnalite, e.target.value]
                              }));
                              e.target.value = '';
                            }
                          }}
                          className="res-multiselect-input-field"
                          disabled={isLoading}
                        />
                        <button 
                          className="res-dropdown-toggle"
                          onClick={() => !isLoading && setShowFeaturesDropdown(!showFeaturesDropdown)}
                          disabled={isLoading}
                        >
                          {showFeaturesDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                      {showFeaturesDropdown && (
                        <div className="res-multiselect-options">
                          {featuresOptions
                            .filter(option => !currentReservation.fonctionnalite.includes(option))
                            .map((option) => (
                              <div
                                key={option}
                                className="res-multiselect-option"
                                onClick={() => {
                                  if (!isLoading) {
                                    setCurrentReservation(prev => ({
                                      ...prev,
                                      fonctionnalite: [...prev.fonctionnalite, option]
                                    }));
                                    setShowFeaturesDropdown(false);
                                  }
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
                <div className="res-invoice-total">
                  <h3>Détail du prix</h3>
                  {isEditing ? (
                    <>
                      <div className="res-price-edit">
                        <label>Prix de base:</label>
                        <div className="res-price-input">
                          <input
                            type="number"
                            name="prix"
                            value={currentReservation.prix}
                            onChange={handleEditInputChange}
                            min="0"
                            step="0.01"
                            className="res-edit-input"
                            disabled={isLoading}
                          />
                          <span>€</span>
                        </div>
                      </div>
                      <div className="res-price-edit">
                        <label>Prix personnalisation:</label>
                        <div className="res-price-input">
                          <input
                            type="number"
                            name="prix_perso"
                            value={currentReservation.prix_perso}
                            onChange={handleEditInputChange}
                            min="0"
                            step="0.01"
                            className="res-edit-input"
                            disabled={isLoading}
                          />
                          <span>€</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="res-price-row">
                        <span>Prix de base:</span>
                        <span>{formatMoney(currentReservation.prix || 0)}</span>
                      </div>
                      <div className="res-price-row">
                        <span>Prix personnalisation:</span>
                        <span>{formatMoney(currentReservation.prix_perso || 0)}</span>
                      </div>
                    </>
                  )}
                  <div className="res-total-amount">
                    <span>Total:</span>
                    <span>{formatMoney(calculateTotal(currentReservation))}</span>
                  </div>
                </div>
                <div className="res-invoice-footer">
                  <p>Merci pour votre confiance !</p>
                  <p>B2B Réservations - contact@b2b-reservations.com</p>
                </div>
              </div>
            </div>
            <div className="res-modal-footer">
              {!isEditing ? (
                <>
                  <button
                    className="res-btn res-btn-outline"
                    onClick={() => setShowViewModal(false)}
                    disabled={isLoading}
                  >
                    <X size={16} className="mr-2" />
                    Fermer
                  </button>
                  <button 
                    className="res-btn res-btn-primary"
                    onClick={printInvoice}
                    disabled={isLoading}
                  >
                    <Printer size={16} className="mr-2" />
                    Imprimer
                  </button>
                  <button
                    className="res-btn res-btn-success"
                    onClick={enableEditing}
                    disabled={isLoading}
                  >
                    <Edit size={16} className="mr-2" />
                    Modifier
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="res-btn res-btn-outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                  >
                    <X size={16} className="mr-2" />
                    Annuler
                  </button>
                  <button
                    className="res-btn res-btn-success"
                    onClick={handleUpdateReservation}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="res-spinner"></span>
                    ) : (
                      <>
                        <CheckCircle size={16} className="mr-2" />
                        Enregistrer
                      </>
                    )}
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