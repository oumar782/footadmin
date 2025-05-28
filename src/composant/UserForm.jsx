import React, { useState, useEffect } from 'react';
import './UserForm.css';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    motdepase: '',
    role: 'user',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData(user);
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
    
    if (!formData.name.trim()) newErrors.name = 'Le nom est obligatoire';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    if (!formData.motdepase.trim()) newErrors.motdepase = 'Le mot de passe est obligatoire';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) onSubmit(formData);
  };

  return (
    <div className="modal-overlayss">
      <div className="modal-contents">
        <div className="modal-headers">
          <h2>{user?.id ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</h2>
          <button className="modal-close" onClick={onCancel}>&times;</button>
        </div>
        
        <div className="modal-body">
          <form className="user-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom complet</label>
              <input
                type="text"
                name="name"
                placeholder="Jean Dupont"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
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
                name="motdepase"
                placeholder="••••••••"
                value={formData.motdepase}
                onChange={handleChange}
                className={errors.motdepase ? 'input-error' : ''}
              />
              {errors.motdepase && <span className="error-text">{errors.motdepase}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Rôle</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="user">Gestionnaire</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="form-group">
                <label>Statut</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {user?.id ? 'Mettre à jour' : 'Créer utilisateur'}
              </button>
              <button type="button" className="btn-cancel" onClick={onCancel}>
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