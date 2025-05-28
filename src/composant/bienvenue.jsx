import React from 'react';

const WelcomeSection = () => {
  return (
    <div style={styles.welcomeContainer}>
      <div style={styles.contentWrapper}>
        <div style={styles.textContent}>
          <h1 style={styles.title}>Bienvenue sur  <span style={styles.highlightedText}>"Foot admin suite"</span> </h1>
          <p style={styles.subtitle}>
            Découvrez une expérience unique conçue spécialement pour vous en tant que <span style={styles.highlightedText}>"Gestionnaire"</span>
          </p>
         
        </div>
        <div style={styles.imageContainer}>
          <div style={styles.imagePlaceholder}></div>
        </div>
      </div>
      
      <div style={styles.featuresContainer}>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🚀</div>
          <h3 style={styles.featureTitle}>Performance</h3>
          <p style={styles.featureText}>Une plateforme ultra-rapide et réactive</p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>✨</div>
          <h3 style={styles.featureTitle}>Modernité</h3>
          <p style={styles.featureText}>Design élégant et intuitif</p>
        </div>
      
      </div>
    </div>
  );
};

// Styles CSS en objet JavaScript
const styles = {
  welcomeContainer: {
    width: '1200px', // <-- corrige ici (minuscule)
    margin: '0 auto',
    padding: '10px 60px',
    backgroundColor: '#f8f9fa',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 2)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    marginLeft: '110px',
    marginTop: '50px',
    position:'fixed'
},
  contentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '60px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
    },
  },
  textContent: {
    flex: 1,
    paddingRight: '40px',
    '@media (max-width: 768px)': {
      paddingRight: '0',
      marginBottom: '40px',
      textAlign: 'center',
    },
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '20px',
    lineHeight: '1.2',
    '@media (max-width: 768px)': {
      fontSize: '2rem',
    },
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'black',
    marginBottom: '30px',
    lineHeight: '1.6',
    maxWidth: '500px',
    '@media (max-width: 768px)': {
      maxWidth: '100%',
    },
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    '@media (max-width: 768px)': {
      justifyContent: 'center',
    },
  },
  primaryButton: {
    padding: '12px 24px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#2980b9',
      transform: 'translateY(-2px)',
    },
  },
  secondaryButton: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#3498db',
    border: '2px solidrgb(4, 54, 22)',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#f0f8ff',
      transform: 'translateY(-2px)',
    },
  },
  imageContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    '@media (max-width: 768px)': {
      width: '100%',
    },
  },
  imagePlaceholder: {
    width: '400px',
    height: '300px',
    backgroundColor: '#e0e0e0',
    borderRadius: '12px',
    backgroundImage: 'linear-gradient(135deg,rgb(3, 84, 4) 0%,rgb(27, 29, 27) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#7f8c8d',
    fontSize: '1.2rem',
    '@media (max-width: 768px)': {
      width: '100%',
      maxWidth: '400px',
    },
  },
  featuresContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 2)',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 6px 12px rgba(14, 132, 48, 2)',
    },
  },
  featureIcon: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  featureTitle: {
    fontSize: '1.3rem',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  featureText: {
    color: '#7f8c8d',
    lineHeight: '1.6',
  },
  highlightedText: {
    color: 'green',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',

  },
};


export default WelcomeSection;