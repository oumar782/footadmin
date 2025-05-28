import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserCircle } from 'lucide-react';
import './Authentification.css';

const AuthComponent = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motdepasse: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', isSuccess: false, show: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const showMessage = (text, isSuccess) => {
    setMessage({ text, isSuccess, show: true });
    setTimeout(() => setMessage(prev => ({ ...prev, show: false })), 5000);
  };

  const closeMessage = () => {
    setMessage(prev => ({ ...prev, show: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { email, motdepasse, role } = formData;

    if (!email || !motdepasse || !role) {
      showMessage('Veuillez remplir tous les champs', false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, motdepasse })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      if (data.success && data.user) {
        const { id, nom, email, role } = data.user;

        localStorage.setItem('userId', id);
        localStorage.setItem('userNom', nom);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', role);

        showMessage('Connexion réussie!', true);

        setTimeout(() => {
          switch (role) {
            case 'Administrateur':
              window.location.href = '/administrateur';
              break;
            case 'Gestionnaire':
              window.location.href = '/bienvenues';
              break;
            default:
              window.location.href = '/';
              break;
          }
        }, 2000);
      } else {
        showMessage("Données utilisateur invalides", false);
      }

    } catch (error) {
      showMessage(error.message || 'Erreur de communication avec le serveur', false);
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-app">
      <div className={`message-box ${message.isSuccess ? 'success' : 'error'} ${message.show ? 'show' : ''}`}>
        <span>{message.text}</span>
        <button className="close-btn" onClick={closeMessage}>&times;</button>
      </div>

      <div className="auth-container">
        {isLoading && (
          <div className="loader">
            <div className="spinner"></div>
          </div>
        )}

        <div className="auth-header">
          <h1>FootSpace Admin Suite</h1>
          <p>Veuillez vous authentifier pour rejoindre votre poste</p>
        </div>

        <div className="auth-body">
          <form id="authForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nom">Nom complet</label>
              <div className="input-field">
                <User className="input-icon" size={18} />
                <input 
                  type="text" 
                  id="nom" 
                  name="nom" 
                  placeholder="Entrez votre nom complet" 
                  value={formData.nom}
                  onChange={handleInputChange}
                  
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Adresse email</label>
              <div className="input-field">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Entrez votre email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="motdepasse">Mot de passe</label>
              <div className="input-field">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="motdepasse" 
                  name="motdepasse" 
                  placeholder="Créez un mot de passe" 
                  value={formData.motdepasse}
                  onChange={handleInputChange}
                  required 
                />
                {showPassword ? (
                  <EyeOff className="password-toggle" size={18} onClick={togglePasswordVisibility} />
                ) : (
                  <Eye className="password-toggle" size={18} onClick={togglePasswordVisibility} />
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role">Rôle</label>
              <div className="input-field">
                <UserCircle className="input-icon" size={18} />
                <select 
                  id="role" 
                  name="role" 
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Sélectionnez votre rôle</option>
                  <option value="Administrateur">Administrateur</option>
                  <option value="Gestionnaire">Gestionnaire</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn">Se connecter</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
