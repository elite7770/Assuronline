# Assurance Auto & Moto – Espace Client (AssurOnline)

## Project Structure (refactor scaffold)

```
src/
  components/
  pages/
  layouts/
  styles/
  utils/
  services/
  shared/
```

Environment:

- Frontend: `.env` with `REACT_APP_API_URL`

Scripts:

- `npm start` to run UI locally

Une application web moderne et complète pour la gestion des assurances automobiles et motos au Maroc, avec un espace client sécurisé et convivial.

## 🚀 Fonctionnalités Principales

### **Espace Client**

- Authentification (connexion/inscription) et accès simplifié aux services clés

### **Système d'Authentification**

- Connexion sécurisée avec email/mot de passe
- Inscription de nouveaux clients
- Gestion des sessions et déconnexion
- Protection des routes sensibles

### **Devis en Ligne**

- Formulaire multi-étapes pour devis d'assurance
- Calcul automatique des primes en MAD
- Options de couverture adaptées au marché marocain
- Validation des données en temps réel

## 🛠️ Technologies Utilisées

- **Frontend** : React 18 avec Hooks
- **Routing** : React Router v7
- **Gestion d'état** : Context API + Local Storage
- **Formulaires** : React Hook Form
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Styling** : CSS Modules avec design system personnalisé

## 🚀 Installation et Démarrage

### **Prérequis**

- Node.js 16+
- npm ou yarn

### **Installation**

```bash
# Cloner le projet
git clone [url-du-repo]

# Installer les dépendances
npm install

# Démarrer en mode développement
npm start

# Build de production
npm run build
```

### **Variables d'Environnement**

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
```

## 🔐 Système d'Authentification

### **Connexion**

- Email : `client@example.com`
- Mot de passe : `password123`

### **Fonctionnalités de Sécurité**

- Validation des données côté client
- Gestion des sessions avec Local Storage
- Protection des routes sensibles
- Déconnexion automatique

## 💼 Gestion des Polices

### **Types de Couverture**

- **RC Obligatoire** : Responsabilité civile obligatoire
- **Vol** : Protection contre le vol
- **Incendie** : Protection contre l'incendie
- **Bris de glace** : Protection des vitres
- **Assistance** : Services d'assistance routière
- **Défense** : Protection juridique

### **Informations des Polices**

- Numéro de police unique
- Détails du véhicule (marque, modèle, année)
- Plaque d'immatriculation
- Dates de début et fin
- Prime annuelle en MAD
- Franchise configurable
- Statut (Active, En attente, Expirée)

## 📋 Gestion des Sinistres

### **Types de Sinistres**

- Accidents de voiture
- Vol
- Dégâts
- Incendie
- Autres

### **Processus de Déclaration**

1. Sélection du type de sinistre
2. Date et description détaillée
3. Police concernée
4. Montant estimé
5. Upload de documents de preuve
6. Suivi de l'avancement

### **Statuts des Sinistres**

- **En cours** : En cours de traitement
- **En attente** : En attente de documents
- **Terminé** : Traitement terminé

## 💳 Système de Facturation

### **Gestion des Factures**

- Historique complet des factures
- Statuts de paiement (Payée, En attente)
- Dates d'échéance
- Montants en MAD
- Téléchargement des factures

### **Paiements**

- Interface de paiement en ligne
- Suivi des échéances
- Historique des transactions

## 📄 Gestion des Documents

### **Types de Documents**

- Certificats d'assurance
- Factures de réparation
- Permis de conduire
- Constats amiable
- Photos de dégâts
- Autres justificatifs

### **Fonctionnalités**

- Upload de fichiers (PDF, JPG, PNG)
- Organisation par police
- Téléchargement sécurisé
- Historique des uploads

## 🔔 Système de Notifications

### **Types de Notifications**

- **Renouvellement** : Expiration des polices
- **Paiement** : Confirmation de paiement
- **Sinistre** : Mise à jour des dossiers

### **Fonctionnalités**

- Badge de notifications non lues
- Panel déroulant interactif
- Marquage comme lu
- Historique des notifications

## 🎨 Design et Interface

### **Thème Visuel**

- Palette bleue professionnelle + accents brand
- Design moderne, épuré et cohérent
- Composants réutilisables, lisibles et accessibles
- Responsive design (mobile-first)

### **Composants UI**

- Cartes interactives avec hover effects
- Boutons avec états et icônes
- Formulaires avec validation
- Navigation par onglets
- Modales et dropdowns

## 📱 Responsive Design

### **Breakpoints**

- **Desktop** : 1200px+
- **Tablet** : 768px - 1199px
- **Mobile** : 320px - 767px

### **Adaptations Mobile**

- Navigation adaptée
- Grilles flexibles
- Boutons tactiles
- Formulaires optimisés

## 🔧 Configuration

### **Authentification**

- Modifier les données utilisateur dans `AuthContext.js`
- Configurer les endpoints API
- Ajuster la logique de validation

### **Données Mock**

- Polices d'exemple dans `AuthContext.js`
- Sinistres et factures de démonstration
- Notifications système

## 📊 Données et Modèles

### **Structure Utilisateur**

```javascript
{
  id: string,
  name: string,
  email: string,
  phone: string,
  address: string,
  postalCode: string,
  city: string,
  clientSince: string,
  status: string,
  policies: Policy[],
  claims: Claim[],
  invoices: Invoice[],
  documents: Document[],
  notifications: Notification[]
}
```

### **Structure Police**

```javascript
{
  id: string,
  type: string,
  vehicle: string,
  brand: string,
  model: string,
  year: number,
  plateNumber: string,
  startDate: string,
  endDate: string,
  status: string,
  premium: number,
  franchise: number,
  coverage: string[],
  nextRenewal: string
}
```

## 🔒 Sécurité

### **Mesures Implémentées**

- Validation des données côté client
- Protection des routes sensibles
- Gestion sécurisée des sessions
- Validation des types de fichiers

### **Recommandations de Production**

- Implémenter HTTPS
- Ajouter l'authentification à deux facteurs
- Intégrer un système de logs
- Mettre en place un WAF

## 🚧 Développement Futur

### **Fonctionnalités Prévues**

- Intégration API backend
- Système de chat en direct
- Notifications push
- Application mobile
- Intégration paiement en ligne
- Système de bonus-malus

### **Améliorations Techniques**

- Tests unitaires et d'intégration
- Optimisation des performances
- PWA (Progressive Web App)
- Internationalisation (arabe/français)

## 📞 Support et Contact

### **Documentation**

- Ce README contient toutes les informations nécessaires
- Code commenté et structuré
- Composants réutilisables

### **Développement**

- Architecture modulaire
- Séparation des responsabilités
- Code maintenable et extensible

## 📄 Licence

Ce projet est développé pour Assurance Auto & Moto Maroc.
Tous droits réservés.

---

**Version** : 2.1.0  
**Dernière mise à jour** : Janvier 2025  
**Développé par** : Équipe de développement Assurance Auto & Moto

## 📚 Documentation Technique

Pour plus de détails sur l'architecture technique, la structure du code et les recommandations de développement, consultez le [Rapport Technique](RAPPORT_TECHNIQUE.md).

## ✅ Améliorations Récentes (Changelog)

Dates approximatives Janv. 2025. Les PR/commits associent ces changements à la cohérence visuelle, l'accessibilité et l'ergonomie.

- Footer – Newsletter CTA redesign et intégration
  - CTA placé à l'intérieur du `<footer>` avant les liens pour une hiérarchie claire.
  - Nouveau style « card » centré, avec gradient doux se fondant dans le fond du footer, coins arrondis, contraste élevé et états `hover`/`focus` accessibles.
  - Fichier impacté: `src/components/layout/Footer.js`, `src/styles/Footer.css`.

- Accessibilité et interactions
  - Champs de la newsletter: focus-visible clair, placeholder contrasté, messages d'état (succès/erreur) lisibles.
  - Bouton CTA: anneau de focus, transitions douces, état disabled explicite.

- Mobile/responsive
  - Formulaire newsletter: stack input/bouton en mobile, largeur 100%.
  - Grilles et sections: comportements adaptés aux breakpoints.

## 📸 Captures d'écran / GIFs

Ajoutez des visuels dans `public/screenshots/` puis référencez-les ci-dessous. Les chemins sont relatifs au README.

Homepage (Hero + CTA)

![Homepage](public/screenshots/home-hero.png)

Footer – Newsletter CTA

![Footer Newsletter CTA](public/screenshots/footer-newsletter.png)

Flux Devis (GIF recommandé)

![Devis Flow](public/screenshots/devis-flow.gif)

Note: Optimisez les images (WebP/PNG, < 1MB) pour de meilleures perfs.

## 🤝 Guide de Contribution

1. Forkez ce repo et créez votre branche de fonctionnalité
   - `git checkout -b feat/ma-fonctionnalite`
2. Installez et lancez le projet en local
   - `npm install && npm start`
3. Suivez les conventions
   - Style: respecter les règles CSS existantes et l'accessibilité (focus, contrastes)
   - Commits: `type(scope): message` (ex: `feat(footer): redesign newsletter CTA`)
   - Tests: si applicable, ajouter/mettre à jour les tests
4. Exécutez un build local
   - `npm run build` (doit passer sans erreurs)
5. Ouvrez une Pull Request
   - Décrivez le contexte, les changements, et joignez des screenshots/GIFs
   - Liez l'issue correspondante si elle existe

### Checklist PR

- [ ] Aucune erreur au build/lint
- [ ] Screenshots/GIFs inclus si UI
- [ ] Accessibilité vérifiée (focus visible, contrastes, labels)
- [ ] Docs/README mis à jour si nécessaire
