import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Demonstration.css';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => onClose(), 3000);
        return () => clearTimeout(timer);
    }, [onClose]);
    return (
        <div className={`toast toast-${type}`}>
            <p>{message}</p>
            <button className="toast-close" onClick={onClose}>&times;</button>
        </div>
    );
};

const ClientModal = ({ client, onClose, isOpen }) => {
    const [modalState, setModalState] = useState('exited');
    useEffect(() => {
        if (isOpen) {
            setModalState('entering');
            setTimeout(() => setModalState('entered'), 10);
        } else {
            setModalState('exiting');
            setTimeout(() => setModalState('exited'), 300);
        }
    }, [isOpen]);

    if (!isOpen && modalState === 'exited') return null;

    // Debug: Vérifiez les données reçues
    console.log('Client data in modal:', client);

    return (
        <div className={`modal-overlay ${modalState !== 'exited' ? 'active' : ''}`}>
            <div className="modal-overlay-bg" onClick={onClose} />
            <div className={`modal-content ${modalState}`}>
                <button onClick={onClose} className="modal-close-btn" aria-label="Fermer">
                    &times;
                </button>
                <div className="modal-body">
                    <h2 className="modal-title">Détails de la Démonstration</h2>
                    <div className="client-details-container">
                        <div className="client-info-section">
                            <div className="detail-item">
                                <span className="detail-label">ID:</span>
                                <span className="detail-value">{client?.id_demonstration || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Nom:</span>
                                <span className="detail-value">{client?.nom}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{client?.email}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Entreprise:</span>
                                <span className="detail-value">{client?.entreprise || 'Non spécifié'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Terrains:</span>
                                <span className="detail-value">{client?.nombreterrains}</span>
                            </div>
                        </div>
                        <div className="message-section">
                            <div className="detail-item">
                                <span className="detail-label">Message:</span>
                                <div className="message-content">
                                    {client?.message 
                                        ? <p className="message-text">{client.message}</p>
                                        : <p className="no-message">Aucun message fourni</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button onClick={onClose} className="btn btn-secondary">
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClientForm = ({ clientToEdit, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        entreprise: '',
        nombreterrains: '',
        message: ''
    });

    useEffect(() => {
        if (clientToEdit) {
            setFormData({
                nom: clientToEdit.nom || '',
                email: clientToEdit.email || '',
                entreprise: clientToEdit.entreprise || '',
                nombreterrains: clientToEdit.nombreterrains || '',
                message: clientToEdit.message || ''
            });
        }
    }, [clientToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="client-form animate-fade-in">
            <h2 className="form-title">
                {clientToEdit ? 'Modifier la démonstration' : 'Ajouter une nouvelle démonstration'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    {clientToEdit && (
                        <div className="form-group">
                            <label htmlFor="id" className="form-label">ID</label>
                            <input
                                type="text"
                                id="id"
                                name="id"
                                value={clientToEdit.id_demonstration}
                                className="form-input"
                                disabled
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="nom" className="form-label">Nom</label>
                        <input
                            type="text"
                            id="nom"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            className="form-input"
                            required
                            placeholder="Entrez le nom"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            required
                            placeholder="Entrez l'email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="entreprise" className="form-label">Entreprise</label>
                        <input
                            type="text"
                            id="entreprise"
                            name="entreprise"
                            value={formData.entreprise}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Nom de l'entreprise"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombreterrains" className="form-label">Nombre de terrains</label>
                        <input
                            type="number"
                            id="nombreterrains"
                            name="nombreterrains"
                            value={formData.nombreterrains}
                            onChange={handleChange}
                            className="form-input"
                            required
                            min="0"
                            placeholder="0"
                        />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="message" className="form-label">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="3"
                            className="form-textarea"
                            placeholder="Notes ou commentaires..."
                        />
                    </div>
                </div>
                <div className="form-footer">
                    <button type="button" onClick={onCancel} className="btn btn-cancel">
                        Annuler
                    </button>
                    <button type="submit" className="btn btn-primary">
                        {clientToEdit ? 'Mettre à jour' : 'Ajouter'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const ClientsList = ({ clients = [], onEdit, onDelete, onView, isLoading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredClients = clients.filter(client =>
        client?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(client?.nombreterrains).toLowerCase().includes(searchTerm.toLowerCase()) ||
        client?.entreprise?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="clients-list animate-fade-in">
            <div className="list-header">
                <h2 className="list-title">Liste des Démonstrations</h2>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Rechercher une démonstration..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>
            {isLoading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Chargement des démonstrations...</p>
                </div>
            ) : filteredClients.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3 className="empty-title">Aucune démonstration trouvée</h3>
                    <p className="empty-message">
                        {searchTerm ? 'Aucun résultat pour votre recherche' : 'Commencez par ajouter une nouvelle démonstration'}
                    </p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="clients-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Entreprise</th>
                                <th>Terrains</th>
                                <th>Message</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map((client) => (
                                <tr key={client.id_demonstration} className="table-row">
                                    <td>{client.id_demonstration}</td>
                                    <td>
                                        <div className="client-info" onClick={() => onView(client)} style={{ cursor: 'pointer' }}>
                                            <div className="client-avatar">
                                                {client.nom?.split(' ').map(name => name.charAt(0)).join('')}
                                            </div>
                                            <div className="client-details">
                                                <div className="client-name">{client.nom}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{client.email}</td>
                                    <td>{client.entreprise || 'Non spécifié'}</td>
                                    <td>
                                        <span className="fields-count">
                                            {client.nombreterrains}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="client-message-preview">
                                            {client.message ? client.message.substring(0, 20) + (client.message.length > 20 ? '...' : '') : 'Aucun message'}
                                        </div>
                                    </td>
                                    <td className="actions-cell">
                                        <div className="actions-container">
                                            <button
                                                onClick={() => onView(client)}
                                                className="action-btn view-btn"
                                                title="Voir"
                                                aria-label="Voir les détails"
                                            >
                                                👁️
                                            </button>
                                            <button
                                                onClick={() => onEdit(client)}
                                                className="action-btn edit-btn"
                                                title="Modifier"
                                                aria-label="Modifier la démonstration"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => onDelete(client.id_demonstration)}
                                                className="action-btn delete-btn"
                                                title="Supprimer"
                                                aria-label="Supprimer la démonstration"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const Demonstration = () => {
    const [demonstrations, setDemonstrations] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [demonstrationToEdit, setDemonstrationToEdit] = useState(null);
    const [demonstrationToView, setDemonstrationToView] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(toast => toast.id !== id)), 3000);
    };

    const fetchDemonstrations = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/demonstrations/');
            setDemonstrations(response.data.data || []);
            setError(null);
            addToast("Liste des démonstrations chargée avec succès", "success");
        } catch (err) {
            console.error('Erreur:', err);
            const errorMsg = err.response?.data?.message || 'Erreur lors du chargement des données';
            setError(errorMsg);
            addToast(errorMsg, "error");
            setDemonstrations([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                const errorMsg = error.response?.data?.message || 'Erreur de communication avec le serveur';
                setError(errorMsg);
                addToast(errorMsg, "error");
                return Promise.reject(error);
            }
        );
        fetchDemonstrations();
        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    const handleAddDemonstration = () => {
        setDemonstrationToEdit(null);
        setShowForm(true);
    };

    const handleEditDemonstration = (demonstration) => {
        setDemonstrationToEdit(demonstration);
        setShowForm(true);
    };

    const handleDeleteDemonstration = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette démonstration ?')) {
            try {
                const numericId = Number(id);
                if (isNaN(numericId)) {
                    throw new Error("ID invalide");
                }
                const response = await axios.delete(`http://localhost:5000/api/demonstrations/${numericId}`);
                if (response.data.success) {
                    addToast("Démonstration supprimée avec succès", "success");
                    await fetchDemonstrations();
                } else {
                    throw new Error(response.data.message || "Échec de la suppression");
                }
            } catch (err) {
                console.error("Erreur:", {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status
                });
                addToast(err.response?.data?.message || "Échec de la suppression", "error");
            }
        }
    };

    const handleViewDemonstration = (demonstration) => {
        setDemonstrationToView(demonstration);
        setIsModalOpen(true);
    };

    const handleSubmitForm = async (formData) => {
        try {
            if (demonstrationToEdit) {
                await axios.put(
                    `http://localhost:5000/api/demonstrations/${demonstrationToEdit.id_demonstration}`,
                    formData
                );
                addToast("Démonstration mise à jour avec succès", "success");
            } else {
                await axios.post('http://localhost:5000/api/demonstrations', formData);
                addToast("Démonstration créée avec succès", "success");
            }
            await fetchDemonstrations();
            setShowForm(false);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Erreur lors de la sauvegarde';
            console.error('Erreur:', err);
            setError(errorMsg);
            addToast(errorMsg, "error");
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setDemonstrationToEdit(null);
    };

    return (
        <div className="app-container">
            <div className="main-content">
                <div className="page-header">
                    <h1 className="page-title">Gestion des démonstrations</h1>
                    {!showForm && (
                        <button
                            onClick={handleAddDemonstration}
                            className="btn btn-primary add-client-btn"
                            aria-label="Ajouter une démonstration"
                        >
                            Ajouter une démonstration
                        </button>
                    )}
                </div>
                {error && (
                    <div className="error-alert">
                        <p>{error}</p>
                        <button onClick={() => setError(null)} className="close-error-btn">
                            &times;
                        </button>
                    </div>
                )}
                {showForm ? (
                    <ClientForm
                        clientToEdit={demonstrationToEdit}
                        onSubmit={handleSubmitForm}
                        onCancel={handleCancelForm}
                    />
                ) : (
                    <ClientsList
                        clients={demonstrations}
                        onEdit={handleEditDemonstration}
                        onDelete={handleDeleteDemonstration}
                        onView={handleViewDemonstration}
                        isLoading={isLoading}
                    />
                )}
            </div>
            <ClientModal
                client={demonstrationToView}
                onClose={() => setIsModalOpen(false)}
                isOpen={isModalOpen}
            />
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                    />
                ))}
            </div>
        </div>
    );
};

export default Demonstration;