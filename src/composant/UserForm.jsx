import React, { useState, useEffect } from 'react';
import './UserForm.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motdepasse: '',
    role: '',
    statut: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        email: user.email || '',
        motdepasse: '',
        role: user.role || '',
        statut: user.statut || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est obligatoire';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    if (!user?.id_utilisateur && !formData.motdepasse.trim()) {
      newErrors.motdepasse = 'Le mot de passe est obligatoire';
    } else if (formData.motdepasse && formData.motdepasse.length < 6) {
      newErrors.motdepasse = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (!formData.role) newErrors.role = 'Le rôle est obligatoire';
    if (!formData.statut) newErrors.statut = 'Le statut est obligatoire';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const dataToSend = { ...formData };
      
      if (user?.id_utilisateur && !dataToSend.motdepasse) {
        delete dataToSend.motdepasse;
      }
      
      const response = await fetch(user?.id_utilisateur 
        ? `http://localhost:5000/api/ajoutuser/${user.id_utilisateur}` 
        : 'http://localhost:5000/api/ajoutuser/', {
        method: user?.id_utilisateur ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la requête');
      }
      
      toast.success(user?.id_utilisateur 
        ? 'Utilisateur mis à jour avec succès' 
        : 'Utilisateur créé avec succès');
      
      onSubmit(result.data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlayss">
      <div className="modal-contents">
        <div className="modal-headers">
          <h2>{user?.id_utilisateur ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</h2>
          <button className="modal-close" onClick={onCancel}>&times;</button>
        </div>
        
        <div className="modal-body">
          <form className="user-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom complet</label>
              <input
                type="text"
                name="nom"
                placeholder="Jean Dupont"
                value={formData.nom}
                onChange={handleChange}
                className={errors.nom ? 'input-error' : ''}
              />
              {errors.nom && <span className="error-text">{errors.nom}</span>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="jean@exemple.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Mot de passe</label>
              <input
                type="password"
                name="motdepasse"
                placeholder={user?.id_utilisateur ? 'Laisser vide pour ne pas changer' : '••••••••'}
                value={formData.motdepasse}
                onChange={handleChange}
                className={errors.motdepasse ? 'input-error' : ''}
              />
              {errors.motdepasse && <span className="error-text">{errors.motdepasse}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Rôle</label>
                <select 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                  className={errors.role ? 'input-error' : ''}
                >
                  <option value="">Sélectionnez un rôle</option>
                  <option value="Administrateur">Administrateur</option>
                  <option value="Gestionnaire">Gestionnaire</option>
                </select>
                {errors.role && <span className="error-text">{errors.role}</span>}
              </div>

              <div className="form-group">
                <label>Statut</label>
                <select 
                  name="statut" 
                  value={formData.statut} 
                  onChange={handleChange}
                  className={errors.statut ? 'input-error' : ''}
                >
                  <option value="">Sélectionnez un statut</option>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="suspendu">Suspendu</option>
                </select>
                {errors.statut && <span className="error-text">{errors.statut}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'En cours...' : user?.id_utilisateur ? 'Mettre à jour' : 'Créer utilisateur'}
              </button>
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;