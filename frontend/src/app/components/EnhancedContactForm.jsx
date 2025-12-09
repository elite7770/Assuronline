import { useState } from 'react';
import {
  Phone,
  Mail,
  FileText,
  CreditCard,
  User,
  Upload,
  X,
  Send,
  Building2,
  MessageSquare,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import '../../assets/styles/enhanced-contact-form.css';

function EnhancedContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    policyNumber: '',
    message: '',
    subject: '',
    preferredContact: 'email',
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const subjectOptions = [
    { value: 'general', label: 'Demande générale' },
    { value: 'claim', label: 'Déclaration de sinistre' },
    { value: 'policy', label: 'Question sur la police' },
    { value: 'payment', label: 'Paiement et facturation' },
    { value: 'renewal', label: 'Renouvellement de contrat' },
    { value: 'update', label: 'Mise à jour des informations' },
    { value: 'other', label: 'Autre' },
  ];

  const quickSupportLinks = [
    {
      title: 'Déclarer un sinistre',
      description: 'Soumettez votre déclaration en ligne',
      icon: <FileText className="quick-support-icon" />,
      link: '/claims',
    },
    {
      title: 'Mettre à jour mes informations',
      description: 'Modifiez vos coordonnées personnelles',
      icon: <User className="quick-support-icon" />,
      link: '/profile',
    },
    {
      title: 'Renouveler un contrat',
      description: 'Gérez vos renouvellements facilement',
      icon: <CreditCard className="quick-support-icon" />,
      link: '/renewal',
    },
    {
      title: 'FAQ et Support',
      description: 'Trouvez rapidement des réponses',
      icon: <HelpCircle className="quick-support-icon" />,
      link: '/faq',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      file: file,
    }));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setSelectedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        policyNumber: '',
        message: '',
        subject: '',
        preferredContact: 'email',
      });
      setSelectedFiles([]);
    }, 5000);
  };

  const handleQuickLinkClick = (link) => {
    try {
      if (!link) return;
      if (link.startsWith('/')) {
        window.location.href = link;
      } else {
        window.location.href = `/contact?tab=${encodeURIComponent(link)}`;
      }
    } catch {}
  };

  if (isSubmitted) {
    return (
      <div className="success-message">
        <CheckCircle className="success-icon" />
        <div>
          <h4>Message envoyé avec succès !</h4>
          <p>Nous vous répondrons dans les plus brefs délais. Merci de nous avoir contactés.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-contact-form">
      {/* Quick Support Section */}
      <div className="quick-support-section">
        <h3>Support rapide</h3>
        <p>Accédez rapidement aux services les plus demandés :</p>

        {(() => {
          const featured = quickSupportLinks.find(
            (l) => l.title === 'Mettre à jour mes informations'
          );
          const others = quickSupportLinks.filter(
            (l) => l.title !== 'Mettre à jour mes informations'
          );
          return (
            <>
              {featured && (
                <div
                  className="quick-support-featured"
                  onClick={() => handleQuickLinkClick(featured.link)}
                >
                  <div className="quick-support-icon">{featured.icon}</div>
                  <h4>{featured.title}</h4>
                  <p>{featured.description}</p>
                </div>
              )}
              <div className="quick-support-grid">
                {others.map((link, index) => (
                  <div
                    key={index}
                    className="quick-support-card"
                    onClick={() => handleQuickLinkClick(link.link)}
                  >
                    <div className="quick-support-icon">{link.icon}</div>
                    <h4>{link.title}</h4>
                    <p>{link.description}</p>
                  </div>
                ))}
              </div>
            </>
          );
        })()}
      </div>

      {/* Contact Methods */}
      <div className="contact-methods">
        <div className="contact-method">
          <Phone className="method-icon" />
          <h3>Support téléphonique</h3>
          <p>01 23 45 67 89</p>
          <span className="method-hours">Lun-Ven: 8h-18h, Sam: 9h-12h</span>
          <span className="method-note">Appel gratuit depuis un poste fixe</span>
        </div>

        <div className="contact-method">
          <Mail className="method-icon" />
          <h3>Support par email</h3>
          <p>support@assurance-auto-moto.fr</p>
          <span className="method-hours">Réponse sous 24h</span>
          <span className="method-note">Pour les demandes non urgentes</span>
        </div>

        <div className="contact-method">
          <Building2 className="method-icon" />
          <h3>Bureau principal</h3>
          <p>123 Avenue des Champs-Élysées</p>
          <span className="method-hours">75008 Paris, France</span>
          <span className="method-note">Sur rendez-vous uniquement</span>
        </div>
      </div>

      {/* Maps Section */}
      <div className="maps-section">
        <h3>Notre localisation</h3>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.3522219!3d48.856614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDUxJzIzLjgiTiAywrAyMScwOC4wIkU!5e0!3m2!1sfr!2sfr!4v1234567890"
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '16px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localisation de notre bureau principal"
          ></iframe>
        </div>
      </div>

      {/* Contact Form */}
      <div className="contact-form">
        <div className="contact-header">
          <h2>Formulaire de contact</h2>
          <p>Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <fieldset className="form-section form-fieldset">
            <legend className="form-legend">
              <User className="section-icon" /> Informations personnelles
            </legend>
            <p id="personal-info-desc">Vos coordonnées pour vous recontacter</p>

            <div className="form-row" aria-describedby="personal-info-desc">
              <div className="form-group">
                <label htmlFor="fullName">Nom complet *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  aria-describedby="personal-info-desc"
                  placeholder="Votre nom et prénom"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Adresse email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  aria-describedby="personal-info-desc"
                  placeholder="votre.email@exemple.com"
                />
              </div>
            </div>

            <div className="form-row" aria-describedby="personal-info-desc">
              <div className="form-group">
                <label htmlFor="phone">Numéro de téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  aria-describedby="personal-info-desc"
                  placeholder="01 23 45 67 89"
                />
              </div>

              <div className="form-group">
                <label htmlFor="policyNumber">Numéro de police (optionnel)</label>
                <input
                  type="text"
                  id="policyNumber"
                  name="policyNumber"
                  value={formData.policyNumber}
                  onChange={handleInputChange}
                  aria-describedby="personal-info-desc"
                  placeholder="POL-2024-XXXXX"
                />
              </div>
            </div>
          </fieldset>

          <div className="form-section">
            <h3>
              <MessageSquare className="section-icon" /> Votre demande
            </h3>
            <p>Décrivez-nous votre situation pour un accompagnement optimal</p>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="subject">Sujet de votre demande *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Sélectionnez un sujet</option>
                  {subjectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="preferredContact">Moyen de contact préféré</label>
                <select
                  id="preferredContact"
                  name="preferredContact"
                  value={formData.preferredContact}
                  onChange={handleInputChange}
                >
                  <option value="email">Email</option>
                  <option value="phone">Téléphone</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message détaillé *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="6"
                placeholder="Décrivez votre demande en détail pour nous permettre de vous aider au mieux..."
              />
            </div>
          </div>

          <div className="form-section">
            <h3>
              <Upload className="section-icon" /> Pièces jointes
            </h3>
            <p>Ajoutez des documents pour nous aider à traiter votre demande plus efficacement</p>

            <div className="file-upload-area">
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="file-input"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label htmlFor="file-upload" className="file-upload-label">
                <Upload className="upload-icon" />
                <span>Cliquez pour sélectionner des fichiers</span>
                <span className="upload-hint">PDF, DOC, JPG, PNG (max 10MB par fichier)</span>
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="selected-files">
                <h4>Fichiers sélectionnés :</h4>
                {selectedFiles.map((file) => (
                  <div key={file.id} className="file-item">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{formatFileSize(file.size)}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="remove-file"
                      title="Supprimer le fichier"
                    >
                      <X />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send />
                  Envoyer le message
                </>
              )}
            </button>
          </div>
          <p className="form-note">
            En soumettant ce formulaire, vous acceptez que vos données soient traitées conformément
            à notre politique de confidentialité.
          </p>
        </form>
      </div>
    </div>
  );
}

export default EnhancedContactForm;
