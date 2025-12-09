import { useState } from 'react';
import {
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  FileText,
  Shield,
  Car,
} from 'lucide-react';
import '../../assets/styles/faq-section.css';

const FAQSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const categories = [
    { id: 'all', label: 'Toutes les questions' },
    { id: 'general', label: 'Général' },
    { id: 'claims', label: 'Sinistres' },
    { id: 'policies', label: 'Polices' },
    { id: 'vehicles', label: 'Véhicules' },
    { id: 'contact', label: 'Contact' },
  ];

  const faqData = [
    {
      id: 1,
      question: 'Comment déclarer un sinistre rapidement ?',
      answer:
        "Pour déclarer un sinistre, vous avez 3 options : 1) Utilisez notre formulaire en ligne disponible 24h/24, 2) Appelez-nous au 01 23 45 67 89 (ligne dédiée sinistres), 3) Envoyez un email à sinistres@assurance-auto-moto.fr. Nous vous recommandons de déclarer dans les 48h suivant l'événement pour une prise en charge optimale.",
      category: 'claims',
    },
    {
      id: 2,
      question: 'Quels documents sont nécessaires pour souscrire une assurance ?',
      answer:
        "Pour souscrire une assurance auto ou moto, vous aurez besoin de : votre permis de conduire, la carte grise du véhicule, votre justificatif de domicile (moins de 3 mois), votre relevé d'informations (si vous changez d'assureur), et éventuellement votre historique de sinistres des 3 dernières années.",
      category: 'policies',
    },
    {
      id: 3,
      question: 'Comment modifier mes informations personnelles en ligne ?',
      answer:
        'Vous pouvez modifier vos informations personnelles directement depuis votre espace client en ligne : connectez-vous à votre compte, allez dans "Mon Profil", puis "Modifier mes informations". Les modifications sont prises en compte sous 24h. Vous pouvez aussi nous contacter par téléphone ou email pour des modifications urgentes.',
      category: 'general',
    },
    {
      id: 4,
      question: 'Quelle est la différence entre assurance au tiers et tous risques ?',
      answer:
        "L'assurance au tiers couvre uniquement les dommages que vous causez aux autres (véhicules, personnes, biens). L'assurance tous risques couvre également les dommages à votre propre véhicule, même si vous êtes responsable de l'accident. Elle inclut aussi le vol, l'incendie, et les dégâts naturels.",
      category: 'policies',
    },
    {
      id: 5,
      question: "Comment renouveler mon contrat d'assurance ?",
      answer:
        "Votre contrat se renouvelle automatiquement chaque année. Vous recevrez un avis d'échéance 2 mois avant la date de renouvellement avec les nouvelles conditions et tarifs. Vous pouvez nous contacter pour discuter de vos options, effectuer des modifications, ou résilier votre contrat.",
      category: 'policies',
    },
    {
      id: 6,
      question: 'Que faire en cas de vol de mon véhicule ?',
      answer:
        "En cas de vol, suivez ces étapes : 1) Contactez immédiatement la police pour déposer une plainte, 2) Appelez-nous au 01 23 45 67 89 (ligne sinistres), 3) Rassemblez les documents (carte grise, clés, etc.), 4) Nous vous guiderons dans les démarches et vous accompagnerons dans le processus d'indemnisation.",
      category: 'claims',
    },
    {
      id: 7,
      question: 'Mon assurance couvre-t-elle les dommages causés par la grêle ?',
      answer:
        "Oui, les dommages causés par la grêle sont couverts par l'assurance tous risques. Si vous avez une assurance au tiers, seuls les dommages causés aux autres sont couverts. La franchise applicable est généralement de 300€ pour les dégâts de grêle.",
      category: 'claims',
    },
    {
      id: 8,
      question: "Comment calculer le montant de ma prime d'assurance ?",
      answer:
        'Le montant de votre prime dépend de plusieurs facteurs : votre âge et expérience de conduite, le type et puissance du véhicule, votre lieu de résidence, votre historique de sinistres, les garanties choisies, et votre bonus/malus. Utilisez notre simulateur en ligne pour une estimation personnalisée en 2 minutes.',
      category: 'policies',
    },
    {
      id: 9,
      question: 'Puis-je assurer plusieurs véhicules avec le même contrat ?',
      answer:
        "Oui, nous proposons des contrats multi-véhicules qui vous permettent d'assurer plusieurs véhicules avec des conditions avantageuses : remise de 10% sur le 2ème véhicule, gestion simplifiée, et un seul interlocuteur pour tous vos véhicules.",
      category: 'policies',
    },
    {
      id: 10,
      question: 'Que se passe-t-il si je ne paie pas ma prime ?',
      answer:
        'En cas de non-paiement, votre contrat peut être suspendu après un délai de carence de 10 jours. Nous vous contactons toujours avant toute suspension pour trouver une solution (échelonnement, report de paiement). Contactez-nous rapidement si vous rencontrez des difficultés de paiement.',
      category: 'policies',
    },
    {
      id: 11,
      question: 'Mon assurance couvre-t-elle les dommages causés par un tiers non identifié ?',
      answer:
        "Oui, si vous avez une assurance tous risques, vous êtes couvert même si le tiers n'est pas identifié. Si vous avez une assurance au tiers, vous devrez prouver que vous n'êtes pas responsable pour être indemnisé.",
      category: 'claims',
    },
    {
      id: 12,
      question: 'Comment obtenir un devis personnalisé ?',
      answer:
        'Pour obtenir un devis personnalisé, vous pouvez : 1) Utiliser notre simulateur en ligne (2 minutes), 2) Nous appeler au 01 23 45 67 89, 3) Prendre rendez-vous avec un conseiller en agence. Le devis est gratuit et sans engagement.',
      category: 'general',
    },
    {
      id: 13,
      question: "Quelles sont les garanties incluses dans l'assistance 0 km ?",
      answer:
        "L'assistance 0 km inclut : dépannage mécanique, remorquage, véhicule de prêt (si disponible), rapatriement, hébergement si nécessaire, et prise en charge des frais de transport. Elle est disponible 24h/24 et 7j/7.",
      category: 'policies',
    },
    {
      id: 14,
      question: "Comment contester un refus d'indemnisation ?",
      answer:
        "Si vous contestez un refus d'indemnisation, vous pouvez : 1) Demander une expertise amiable, 2) Saisir le médiateur de l'assurance, 3) Porter l'affaire devant les tribunaux. Nous vous accompagnons dans ces démarches.",
      category: 'claims',
    },
    {
      id: 15,
      question: 'Mon assurance couvre-t-elle les dommages causés par un animal ?',
      answer:
        "Oui, les dommages causés par un animal (chevreuil, sanglier, etc.) sont couverts par l'assurance tous risques. Si vous avez une assurance au tiers, seuls les dommages causés aux autres sont couverts.",
      category: 'claims',
    },
  ];

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'claims':
        return <FileText className="category-icon" />;
      case 'policies':
        return <Shield className="category-icon" />;
      case 'vehicles':
        return <Car className="category-icon" />;
      case 'contact':
        return <MessageSquare className="category-icon" />;
      default:
        return <HelpCircle className="category-icon" />;
    }
  };

  return (
    <div className="faq-section">
      <div className="faq-header">
        <h2>Questions fréquemment posées</h2>
        <p>
          Trouvez rapidement des réponses à vos questions sur nos services d'assurance auto et moto
        </p>
        <div className="faq-stats">
          <span className="stat-item">
            <strong>15 questions</strong> couvrant tous les sujets
          </span>
          <span className="stat-item">
            <strong>5 catégories</strong> pour une recherche facile
          </span>
          <span className="stat-item">
            <strong>24h/24</strong> assistance disponible
          </span>
        </div>
      </div>

      <div className="faq-search">
        <div className="search-container">
          <input
            type="text"
            id="faqSearch"
            aria-label="Rechercher dans les questions"
            placeholder="Rechercher dans les questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Search className="search-icon" />
        </div>
      </div>

      <div className="faq-categories">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {getCategoryIcon(category.id)}
            {category.label}
          </button>
        ))}
      </div>

      <div className="faq-content">
        {filteredFAQs.length === 0 ? (
          <div className="no-results">
            <HelpCircle className="no-results-icon" />
            <p>Aucune question trouvée pour votre recherche.</p>
            <p>Essayez de modifier vos critères ou contactez-nous directement.</p>
          </div>
        ) : (
          <div className="faq-list">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="faq-item">
                <button
                  className={`faq-question ${expandedItems.has(faq.id) ? 'expanded' : ''}`}
                  onClick={() => toggleExpanded(faq.id)}
                >
                  <span>{faq.question}</span>
                  {expandedItems.has(faq.id) ? (
                    <ChevronUp className="expand-icon" />
                  ) : (
                    <ChevronDown className="expand-icon" />
                  )}
                </button>
                {expandedItems.has(faq.id) && <div className="faq-answer">{faq.answer}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="faq-footer">
        <div className="faq-footer-content">
          <div className="faq-footer-text">
            <h3>Vous ne trouvez pas la réponse à votre question ?</h3>
            <p>Notre équipe d'experts est là pour vous aider 24h/24</p>
          </div>
          <div className="faq-actions">
            <button className="contact-btn primary">
              <MessageSquare />
              Nous Contacter
            </button>
            <button className="contact-btn secondary">
              <FileText />
              Demander un Devis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
