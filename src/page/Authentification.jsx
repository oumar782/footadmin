import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserCircle } from 'lucide-react';
import './Authentification.css';

const AuthComponentFS = () => {
  const [formDataFS, setFormDataFS] = useState({
    nomFS: '',
    emailFS: '',
    motdepasseFS: '',
    roleFS: ''
  });
  const [showPasswordFS, setShowPasswordFS] = useState(false);
  const [messageFS, setMessageFS] = useState({ text: '', isSuccess: false, show: false });
  const [isLoadingFS, setIsLoadingFS] = useState(false);

  const handleInputChangeFS = (e) => {
    const { name, value } = e.target;
    setFormDataFS(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibilityFS = () => {
    setShowPasswordFS(!showPasswordFS);
  };

  const showMessageFS = (text, isSuccess) => {
    setMessageFS({ text, isSuccess, show: true });
    setTimeout(() => setMessageFS(prev => ({ ...prev, show: false })), 5000);
  };

  const closeMessageFS = () => {
    setMessageFS(prev => ({ ...prev, show: false }));
  };

  const handleSubmitFS = async (e) => {
    e.preventDefault();
    
    const { emailFS, motdepasseFS, roleFS } = formDataFS;

    if (!emailFS || !motdepasseFS || !roleFS) {
      showMessageFS('Veuillez remplir tous les champs', false);
      return;
    }
    
    setIsLoadingFS(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: emailFS,
          motdepasse: motdepasseFS,
          role: roleFS
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      if (data.success && data.user) {
        const { id, nom, email, role } = data.user;

        localStorage.setItem('userIdFS', id);
        localStorage.setItem('userNomFS', nom);
        localStorage.setItem('userEmailFS', email);
        localStorage.setItem('userRoleFS', role);

        showMessageFS('Connexion réussie!', true);

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
        showMessageFS("Données utilisateur invalides", false);
      }

    } catch (error) {
      showMessageFS(error.message || 'Erreur de communication avec le serveur', false);
      console.error('Erreur:', error);
    } finally {
      setIsLoadingFS(false);
    }
  };

  return (
    <div className="fs-auth-app">
      <div className={`fs-message-box ${messageFS.isSuccess ? 'fs-success' : 'fs-error'} ${messageFS.show ? 'fs-show' : ''}`}>
        <span>{messageFS.text}</span>
        <button className="fs-close-btn" onClick={closeMessageFS}>&times;</button>
      </div>

      <div className="fs-auth-container">
        {isLoadingFS && (
          <div className="fs-loader">
            <div className="fs-spinner"></div>
          </div>
        )}

        <div className="fs-auth-header">
         
          <h1>FootSolutions Admin</h1>
          <p>Veuillez vous authentifier pour rejoindre votre poste</p>
        </div>

        <div className="fs-auth-body">
          <form id="fs-authForm" onSubmit={handleSubmitFS}>
            <div className="fs-form-group">
              <label htmlFor="nomFS">Nom complet</label>
              <div className="fs-input-field">
                <User className="fs-input-icon" size={18} />
                <input 
                  type="text" 
                  id="nomFS" 
                  name="nomFS" 
                  placeholder="Entrez votre nom complet" 
                  value={formDataFS.nomFS}
                  onChange={handleInputChangeFS}
                />
              </div>
            </div>

            <div className="fs-form-group">
              <label htmlFor="emailFS">Adresse email</label>
              <div className="fs-input-field">
                <Mail className="fs-input-icon" size={18} />
                <input 
                  type="email" 
                  id="emailFS" 
                  name="emailFS" 
                  placeholder="Entrez votre email" 
                  value={formDataFS.emailFS}
                  onChange={handleInputChangeFS}
                  required 
                />
              </div>
            </div>

            <div className="fs-form-group">
              <label htmlFor="motdepasseFS">Mot de passe</label>
              <div className="fs-input-field">
                <Lock className="fs-input-icon" size={18} />
                <input 
                  type={showPasswordFS ? "text" : "password"} 
                  id="motdepasseFS" 
                  name="motdepasseFS" 
                  placeholder="Créez un mot de passe" 
                  value={formDataFS.motdepasseFS}
                  onChange={handleInputChangeFS}
                  required 
                />
                {showPasswordFS ? (
                  <EyeOff className="fs-password-toggle" size={18} onClick={togglePasswordVisibilityFS} />
                ) : (
                  <Eye className="fs-password-toggle" size={18} onClick={togglePasswordVisibilityFS} />
                )}
              </div>
            </div>

            <div className="fs-form-group">
              <label htmlFor="roleFS">Rôle</label>
              <div className="fs-input-field">
                <UserCircle className="fs-input-icon" size={18} />
                <select 
                  id="roleFS" 
                  name="roleFS" 
                  value={formDataFS.roleFS}
                  onChange={handleInputChangeFS}
                  required
                >
                  <option value="" disabled>Sélectionnez votre rôle</option>
                  <option value="Administrateur">Administrateur</option>
                  <option value="Gestionnaire">Gestionnaire</option>
                </select>
              </div>
            </div>

            <button type="submit" className="fs-btn">Se connecter</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthComponentFS;