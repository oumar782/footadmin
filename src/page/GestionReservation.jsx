import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Printer, CheckCircle, XCircle, Plus, X, ChevronDown, ChevronUp, 
  Edit, Trash2, Eye, Calendar, User, Briefcase, Mail, Tag, 
  Layers, DollarSign, Search, Filter, BadgeCheck, BadgePercent,
  Settings, CreditCard, ArrowRight, Circle, Check
} from 'lucide-react';
import './Gestionreservation.css';

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
          (r.fonctionnalite && r.fonctionnalite.some((f) => f && f.toLowerCase().includes(term))) ||
          (r.type_perso && r.type_perso.some((t) => t && t.toLowerCase().includes(term))) ||
          (r.statut && r.statut.toLowerCase().includes(term))
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
    if (!formule) return 'badge-basique';
    switch (formule.toLowerCase()) {
      case 'starter':
        return 'badge-premium';
      case 'pro':
        return 'badge-standard';
      case 'enterprise':
        return 'badge-standard';
      default:
        return 'badge-basique';
    }
  };

  // Classes CSS pour les statuts
  const getStatutClass = (statut) => {
    switch (statut) {
      case 'signé':
        return 'statut-signe';
      case 'perdu':
        return 'statut-perdu';
      case 'en_attente':
        return 'statut-attente';
      default:
        return 'statut-attente';
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
              color:rgb(38, 110, 16); 
              margin: 0;
            }
            
            .invoice-logo { 
              font-size: 24px; 
              font-weight: 700; 
              color:rgb(18, 66, 3);
              display: flex;
              align-items: center;
            }
            
            .invoice-logo:before {
              content: "";
              display: inline-block;
              width: 30px;
              height: 30px;
              background-color:rgb(26, 79, 4);
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
              background:rgb(25, 88, 10);
              padding: 20px;
              border-radius: 8px;
            }
            
            .invoice-section h3 { 
              border-bottom: 2px solidrgb(9, 83, 14); 
              padding-bottom: 10px; 
              color:rgb(24, 76, 7);
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
              border-bottom: 2px solidrgb(18, 65, 4); 
              padding-bottom: 10px; 
              color:rgb(6, 82, 12);
              font-size: 18px;
              font-weight: 600;
              margin-top: 0;
              margin-bottom: 15px;
            }
            
            ul { 
              list-style-type: none; 
              padding-left: 0;
              margin: 0;
              color:rgb(63, 11, 11);
            }
            
            li { 
              padding: 8px 0;
              border-bottom: 1px solid #eee;
              display: flex;
              align-items: center;
              color:rgb(8, 4, 4);
            }
            
            li:last-child {
              border-bottom: none;
            }
            
            li:before {
              content: "•";
              color:rgb(6, 83, 28);
              font-weight: bold;
              display: inline-block;
              width: 1em;
              margin-right: 10px;
            }
            
            .invoice-total { 
              background: linear-gradient(135deg,rgb(4, 70, 4), #2c3e50);
              padding: 25px;
              border-radius: 8px;
              color: white;
              margin-bottom: 30px;
            }
            
            .invoice-total h3 {
              color: green;
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
              color:rgb(9, 156, 46); 
              font-size: 14px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            
            .badge { 
              padding: 5px 12px; 
              border-radius: 20px; 
              font-size: 12px; 
              font-weight: 600;
              display: inline-block;
              margin-left: 10px;
              background: linear-gradient(135deg,rgb(12, 116, 7),rgb(166, 182, 22));
            }
            
            .badge-premium { 
              background: linear-gradient(135deg,rgb(12, 116, 7),rgb(166, 182, 22));
              color: white; 
            }
            
            .badge-standard { 
              background: linear-gradient(135deg,rgb(52, 219, 69),rgb(41, 53, 185));
              color: white; 
            }
            
            .badge-basique { 
              background: linear-gradient(135deg, #95a5a6, #7f8c8d);
              color: white; 
            }
            
            .statut-signe {
              background-color: #10b981;
              color: white;
            }
            
            .statut-perdu {
              background-color: #ef4444;
              color: white;
            }
            
            .statut-attente {
              background-color: #f59e0b;
              color: white;
            }
            
            .price-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              color:rgb(193, 10, 10);
            }
            
            .price-label {
              font-weight: bold;
              color:rgb(6, 23, 4);
            }
            
            .price-value {
              font-weight: 600;
              color:rgb(222, 12, 12);
            }
            
            .invoice-number {
              font-size: 14px;
              color:rgb(222, 12, 12);
              margin-top: 5px;
            }
            
            .invoice-date {
              font-size: 14px;
              color:rgb(124, 5, 17);
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
      setNewReservation((prev) => ({
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

  return (
    <div className="containergr">
      {/* En-tête */}
      <header className="app-headergre">
        <div className="app-titlegr">
          <div className="app-icongr">
            <Layers size={24} className="text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Réservations</h1>
        </div>
        <button 
          className="btnre btn-primary flex items-center" 
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
      <div className="search-filter-container bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="search-box relative">
          <input
            type="text"
            placeholder="Rechercher des réservations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="filter-buttons flex flex-wrap gap-2 mt-4">
          <button
            className={`btnre btn-outline ${filter === 'all' ? 'active bg-blue-500 text-white' : ''} flex items-center`}
            onClick={() => setFilter('all')}
          >
            <Filter size={14} className="mr-1" />
            Toutes
          </button>
          <button
            className={`btnre btn-outline ${filter === 'starter' ? 'active bg-purple-600 text-white' : ''} flex items-center`}
            onClick={() => setFilter('starter')}
          >
            <BadgeCheck size={14} className="mr-1" />
            Starter
          </button>
          <button
            className={`btnre btn-outline ${filter === 'pro' ? 'active bg-blue-600 text-white' : ''} flex items-center`}
            onClick={() => setFilter('pro')}
          >
            <BadgePercent size={14} className="mr-1" />
            Pro
          </button>
          <button
            className={`btnre btn-outline ${filter === 'enterprise' ? 'active bg-gray-600 text-white' : ''} flex items-center`}
            onClick={() => setFilter('enterprise')}
          >
            <Settings size={14} className="mr-1" />
            Enterprise
          </button>
        </div>
      </div>

      {/* Tableau des réservations */}
      <div className="reservations-container bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="reservations-header p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="reservations-count text-gray-600">
            {filteredReservations.length}{' '}
            {filteredReservations.length === 1 ? 'réservation trouvée' : 'réservations trouvées'}
          </div>
        </div>
        {filteredReservations.length > 0 ? (
          <div className="table-responsive overflow-x-auto">
            <table className="reservations-table w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perso.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personnalisation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fonctionnalités</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id_reservation} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getBadgeClass(reservation.formule)} inline-flex items-center`}>
                        {reservation.formule === 'Starter' && <BadgeCheck size={14} className="mr-1" />}
                        {reservation.formule === 'Pro' && <BadgePercent size={14} className="mr-1" />}
                        {reservation.formule === 'Enterprise' && <Settings size={14} className="mr-1" />}
                        {reservation.formule || 'Non spécifié'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {reservation.prix || '0'} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {reservation.prix_perso || '0'} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User size={16} className="text-gray-400 mr-2" />
                        <span>{reservation.nom_complet || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Briefcase size={16} className="text-gray-400 mr-2" />
                        <span>{reservation.entreprise || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={`mailto:${reservation.email}`} className="email-link flex items-center">
                        <Mail size={16} className="text-gray-400 mr-2" />
                        {reservation.email || '-'}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="tags-container flex flex-wrap gap-1">
                        {reservation.type_perso && reservation.type_perso.length > 0 ? (
                          reservation.type_perso.map((type, index) => (
                            <span key={index} className="tag bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <Circle size={8} className="mr-1 text-blue-500" />
                              {type}
                            </span>
                          ))
                        ) : (
                          <span className="no-data text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="tags-container flex flex-wrap gap-1">
                        {reservation.fonctionnalite && reservation.fonctionnalite.length > 0 ? (
                          reservation.fonctionnalite.map((feature, index) => (
                            <span key={index} className="tag bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <Check size={8} className="mr-1 text-green-500" />
                              {feature}
                            </span>
                          ))
                        ) : (
                          <span className="no-data text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {calculateTotal(reservation)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`statut ${getStatutClass(reservation.statut)} px-2 py-1 rounded-full text-xs`}>
                        {reservation.statut || 'en_attente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="action-buttons flex space-x-2">
                        <button
                          className="btn btn-view text-blue-600 hover:text-blue-900"
                          onClick={() => viewReservation(reservation)}
                          title="Voir les détails"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn btn-delete text-red-600 hover:text-red-900"
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
          <div className="empty-state p-8 text-center">
            <div className="empty-state-icon mx-auto mb-4 text-gray-400">
              <Layers size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation trouvée</h3>
            <p className="text-gray-500 mb-6">Essayez de modifier vos critères de recherche ou ajoutez une nouvelle réservation</p>
            <button 
              className="btn btn-primary inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
        <div className="modal-overlay active fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="modal-header flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Plus size={20} className="mr-2 text-blue-500" />
                Nouvelle Réservation
              </h2>
              <button 
                className="close-btn text-gray-400 hover:text-gray-500"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body p-6">
              <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
                    <option value="en_attente">En attente</option>
                    <option value="signé">Signé</option>
                    <option value="perdu">Perdu</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Types de Personnalisation</label>
                <div className="multiselect relative">
                  <div
                    className="multiselect-input flex flex-wrap items-center p-2 border border-gray-300 rounded-md cursor-text"
                    onClick={() => setShowCustomizationsDropdown(!showCustomizationsDropdown)}
                  >
                    {newReservation.type_perso.map((type) => (
                      <span key={type} className="tag bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full m-1 flex items-center">
                        {type}
                        <span
                          className="tag-remove ml-1 cursor-pointer hover:text-blue-600"
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
                      className="dropdown-toggle ml-2 text-gray-500 hover:text-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCustomizationsDropdown(!showCustomizationsDropdown);
                      }}
                    >
                      {showCustomizationsDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                  {showCustomizationsDropdown && (
                    <div className="multiselect-options active absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {customizationsOptions
                        .filter(
                          (option) =>
                            option.toLowerCase().includes(currentCustomization.toLowerCase()) &&
                            !newReservation.type_perso.includes(option)
                        )
                        .map((option) => (
                          <div
                            key={option}
                            className="multiselect-option p-2 hover:bg-blue-50 cursor-pointer flex items-center"
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
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fonctionnalités Incluses</label>
                <div className="multiselect relative">
                  <div
                    className="multiselect-input flex flex-wrap items-center p-2 border border-gray-300 rounded-md cursor-text"
                    onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                  >
                    {newReservation.fonctionnalite.map((feature) => (
                      <span key={feature} className="tag bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full m-1 flex items-center">
                        {feature}
                        <span
                          className="tag-remove ml-1 cursor-pointer hover:text-green-600"
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
                      className="dropdown-toggle ml-2 text-gray-500 hover:text-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFeaturesDropdown(!showFeaturesDropdown);
                      }}
                    >
                      {showFeaturesDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                  {showFeaturesDropdown && (
                    <div className="multiselect-options active absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {featuresOptions
                        .filter(
                          (option) =>
                            option.toLowerCase().includes(currentFeature.toLowerCase()) &&
                            !newReservation.fonctionnalite.includes(option)
                        )
                        .map((option) => (
                          <div
                            key={option}
                            className="multiselect-option p-2 hover:bg-green-50 cursor-pointer flex items-center"
                            onClick={() => handleFeatureSelect(option)}
                          >
                            <Check size={8} className="mr-2 text-green-500" />
                            {option}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="form-footer p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                className="btn btn-outline px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                onClick={() => setShowModal(false)}
              >
                <X size={16} className="mr-2" />
                Annuler
              </button>
              <button
                className="btn btn-primary px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
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
        <div className="modal-overlay active fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="modal-header flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                {isEditing ? (
                  <Edit size={20} className="mr-2 text-blue-500" />
                ) : (
                  <Eye size={20} className="mr-2 text-blue-500" />
                )}
                Détails de la Réservation
              </h2>
              <button 
                className="close-btn text-gray-400 hover:text-gray-500"
                onClick={() => setShowViewModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body p-6">
              <div className="invoice-container bg-white p-8 rounded-lg" id="invoice-print">
                <div className="invoice-header flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                  <div>
                    <div className="invoice-title text-2xl font-bold text-gray-800">Facture</div>
                    <div className="invoice-number text-sm text-gray-500 mt-1">
                      Réservation #{currentReservation.id_reservation}
                    </div>
                    <div className="invoice-date text-sm text-gray-500 mt-1">
                      Date: {currentReservation.date ? 
                        new Date(currentReservation.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : '-'}
                    </div>
                  </div>
                  <div className="invoice-logo text-xl font-bold text-blue-500 flex items-center">
                    <span className="w-6 h-6 bg-blue-500 rounded-full mr-2"></span>
                    B2B Réservations
                  </div>
                </div>
                <div className="invoice-details flex flex-col md:flex-row gap-6 mb-8">
                  <div className="invoice-section bg-gray-50 p-4 rounded-lg flex-1">
                    <h3 className="text-lg font-semibold text-blue-500 border-b border-blue-200 pb-2 mb-4">
                      Client
                    </h3>
                    {isEditing ? (
                      <>
                        <div className="form-group mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                          <input
                            type="text"
                            name="nom_complet"
                            value={currentReservation.nom_complet}
                            onChange={handleEditInputChange}
                            className="edit-input w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="form-group mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                          <input
                            type="text"
                            name="entreprise"
                            value={currentReservation.entreprise}
                            onChange={handleEditInputChange}
                            className="edit-input w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="form-group mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={currentReservation.email}
                            onChange={handleEditInputChange}
                            className="edit-input w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="form-group">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                          <select
                            name="statut"
                            value={currentReservation.statut}
                            onChange={handleEditInputChange}
                            className="edit-input w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="en_attente">En attente</option>
                            <option value="signé">Signé</option>
                            <option value="perdu">Perdu</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="mb-2"><strong className="text-gray-700">Nom:</strong> {currentReservation.nom_complet || '-'}</p>
                        <p className="mb-2"><strong className="text-gray-700">Entreprise:</strong> {currentReservation.entreprise || '-'}</p>
                        <p className="mb-2"><strong className="text-gray-700">Email:</strong> {currentReservation.email || '-'}</p>
                        <p><strong className="text-gray-700">Statut:</strong> 
                          <span className={`statut ${getStatutClass(currentReservation.statut)} ml-2 px-2 py-1 rounded-full text-xs`}>
                            {currentReservation.statut || 'en_attente'}
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                  <div className="invoice-section bg-gray-50 p-4 rounded-lg flex-1">
                    <h3 className="text-lg font-semibold text-blue-500 border-b border-blue-200 pb-2 mb-4">
                      Réservation
                    </h3>
                    {isEditing ? (
                      <>
                        <div className="form-group mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Formule</label>
                          <select
                            name="formule"
                            value={currentReservation.formule}
                            onChange={handleEditInputChange}
                            className="edit-input w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="Starter">Starter</option>
                            <option value="Pro">Pro</option>
                            <option value="Enterprise">Enterprise</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            name="date"
                            value={currentReservation.date}
                            onChange={handleEditInputChange}
                            className="edit-input w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="mb-2">
                          <strong className="text-gray-700">Formule:</strong> 
                          <span className={`badge ${getBadgeClass(currentReservation.formule)} ml-2`}>
                            {currentReservation.formule || '-'}
                          </span>
                        </p>
                        <p>
                          <strong className="text-gray-700">Date:</strong> {currentReservation.date ? 
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
                <div className="invoice-personnalisation bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-blue-500 border-b border-blue-200 pb-2 mb-4">
                    Types de Personnalisation
                  </h3>
                  {isEditing ? (
                    <div className="multiselect relative">
                      <div className="multiselect-input flex flex-wrap items-center p-2 border border-gray-300 rounded-md cursor-text">
                        {currentReservation.type_perso.map((type) => (
                          <span key={type} className="tag bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full m-1 flex items-center">
                            {type}
                            <span
                              className="tag-remove ml-1 cursor-pointer hover:text-blue-600"
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
                          className="dropdown-toggle ml-2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowCustomizationsDropdown(!showCustomizationsDropdown)}
                        >
                          {showCustomizationsDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                      {showCustomizationsDropdown && (
                        <div className="multiselect-options active absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {customizationsOptions
                            .filter(option => !currentReservation.type_perso.includes(option))
                            .map((option) => (
                              <div
                                key={option}
                                className="multiselect-option p-2 hover:bg-blue-50 cursor-pointer flex items-center"
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
                <div className="invoice-features bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-blue-500 border-b border-blue-200 pb-2 mb-4">
                    Fonctionnalités Incluses
                  </h3>
                  {isEditing ? (
                    <div className="multiselect relative">
                      <div className="multiselect-input flex flex-wrap items-center p-2 border border-gray-300 rounded-md cursor-text">
                        {currentReservation.fonctionnalite.map((feature) => (
                          <span key={feature} className="tag bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full m-1 flex items-center">
                            {feature}
                            <span
                              className="tag-remove ml-1 cursor-pointer hover:text-green-600"
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
                          className="dropdown-toggle ml-2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                        >
                          {showFeaturesDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                      {showFeaturesDropdown && (
                        <div className="multiselect-options active absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {featuresOptions
                            .filter(option => !currentReservation.fonctionnalite.includes(option))
                            .map((option) => (
                              <div
                                key={option}
                                className="multiselect-option p-2 hover:bg-green-50 cursor-pointer flex items-center"
                                onClick={() => {
                                  setCurrentReservation(prev => ({
                                    ...prev,
                                    fonctionnalite: [...prev.fonctionnalite, option]
                                  }));
                                  setShowFeaturesDropdown(false);
                                }}
                              >
                                <Check size={8} className="mr-2 text-green-500" />
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
                          <li key={idx} className="flex items-center py-2">
                            <Check size={8} className="mr-2 text-green-500" />
                            {feature}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 py-2">Aucune fonctionnalité supplémentaire</li>
                      )}
                    </ul>
                  )}
                </div>
                <div className="invoice-total bg-gradient-to-r from-blue-500 to-gray-800 p-6 rounded-lg mb-6 text-white">
                  <h3 className="text-xl font-semibold border-b border-white border-opacity-20 pb-2 mb-4">
                    Détail du prix
                  </h3>
                  {isEditing ? (
                    <>
                      <div className="price-edit mb-3">
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
                      <div className="price-edit">
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
                      <div className="price-row mb-2">
                        <span className="price-label">Prix de base:</span>
                        <span className="price-value">{currentReservation.prix || '0'} €</span>
                      </div>
                      <div className="price-row mb-2">
                        <span className="price-label">Prix personnalisation:</span>
                        <span className="price-value">{currentReservation.prix_perso || '0'} €</span>
                      </div>
                    </>
                  )}
                  <div className="price-row total-amount mt-4 text-xl font-bold">
                    <span>Total:</span>
                    <span>{calculateTotal(currentReservation)} €</span>
                  </div>
                </div>
                <div className="invoice-footer text-center text-gray-500 text-sm pt-4 border-t border-gray-200">
                  <p>Merci pour votre confiance !</p>
                  <p>B2B Réservations - contact@b2b-reservations.com</p>
                </div>
              </div>
            </div>
            <div className="form-footer p-4 border-t border-gray-200 flex justify-end space-x-3">
              {!isEditing ? (
                <>
                  <button
                    className="btn btn-outline px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center no-print"
                    onClick={() => setShowViewModal(false)}
                  >
                    <X size={16} className="mr-2" />
                    Fermer
                  </button>
                  <button 
                    className="btn btn-primary px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center no-print"
                    onClick={printInvoice}
                  >
                    <Printer size={16} className="mr-2" />
                    Imprimer
                  </button>
                  <button
                    className="btn btn-success px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center no-print"
                    onClick={enableEditing}
                  >
                    <Edit size={16} className="mr-2" />
                    Modifier
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-outline px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center no-print"
                    onClick={() => setIsEditing(false)}
                  >
                    <X size={16} className="mr-2" />
                    Annuler
                  </button>
                  <button
                    className="btn btn-success px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center no-print"
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