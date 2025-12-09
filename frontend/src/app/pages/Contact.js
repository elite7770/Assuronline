import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageSquare, FileText, CreditCard, User } from 'lucide-react';
import '../../assets/styles/contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 5000);
  };

  const quickActions = [
    {
      title: 'Déclarer un sinistre',
      description: 'Soumettez votre déclaration en ligne',
      icon: <FileText size={24} />,
      link: '/claims',
      gradient: 'danger'
    },
    {
      title: 'Espace client',
      description: 'Gérez vos contrats et documents',
      icon: <User size={24} />,
      link: '/espace-client',
      gradient: 'primary'
    },
    {
      title: 'Devis en ligne',
      description: 'Obtenez un devis personnalisé',
      icon: <CreditCard size={24} />,
      link: '/devis',
      gradient: 'success'
    }
  ];

  if (isSubmitted) {
    return (
      <main className="contact-page">
        <div className="success-container">
          <CheckCircle className="success-icon" />
          <h2>Message envoyé avec succès !</h2>
          <p>Nous vous répondrons dans les plus brefs délais.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Contactez-nous</h1>
          <p>Votre partenaire de confiance pour tous vos besoins d'assurance</p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support disponible</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">&lt; 2h</span>
              <span className="stat-label">Temps de réponse</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfaction client</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <div className="container">
          <h2>Actions rapides</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <a key={index} href={action.link} className={`quick-action-card quick-action-card--${action.gradient}`}>
                <div className="quick-action-icon">{action.icon}</div>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info-section">
              <h2>Nos coordonnées</h2>
              <div className="contact-info-grid">
                <div className="contact-info-card">
                  <div className="contact-info-icon">
                    <Phone size={24} />
                  </div>
                  <div className="contact-info-content">
                    <h3>Téléphone</h3>
                    <p>01 23 45 67 89</p>
                    <span>Lun-Ven: 8h-18h, Sam: 9h-12h</span>
                  </div>
                </div>
                
                <div className="contact-info-card">
                  <div className="contact-info-icon">
                    <Mail size={24} />
                  </div>
                  <div className="contact-info-content">
                    <h3>Email</h3>
                    <p>contact@assuronline.fr</p>
                    <span>Réponse sous 24h</span>
                  </div>
                </div>
                
                <div className="contact-info-card">
                  <div className="contact-info-icon">
                    <MapPin size={24} />
                  </div>
                  <div className="contact-info-content">
                    <h3>Adresse</h3>
                    <p>123 Avenue des Champs-Élysées</p>
                    <span>75008 Paris, France</span>
                  </div>
                </div>
                
                <div className="contact-info-card">
                  <div className="contact-info-icon">
                    <Clock size={24} />
                  </div>
                  <div className="contact-info-content">
                    <h3>Horaires</h3>
                    <p>Lundi - Vendredi</p>
                    <span>8h00 - 18h00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="contact-form-card">
                <div className="contact-form-header">
                  <MessageSquare className="form-header-icon" />
                  <h2>Envoyez-nous un message</h2>
                  <p>Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais</p>
                </div>
                
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Nom complet *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Votre nom et prénom"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="votre.email@exemple.com"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Téléphone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="01 23 45 67 89"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="subject">Sujet *</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="general">Demande générale</option>
                        <option value="claim">Déclaration de sinistre</option>
                        <option value="policy">Question sur la police</option>
                        <option value="payment">Paiement et facturation</option>
                        <option value="renewal">Renouvellement de contrat</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="6"
                      placeholder="Décrivez votre demande en détail..."
                    />
                  </div>
                  
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="spinner"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
