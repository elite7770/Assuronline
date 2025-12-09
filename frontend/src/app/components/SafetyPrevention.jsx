import { useEffect, useRef, useState } from 'react';
import {
  Link as ChainIcon,
  CircleDot,
  Disc,
  Lightbulb,
  CloudRain,
  Wind,
  Moon,
  Trophy,
} from 'lucide-react';

const TABS = [
  { id: 'pluie', label: 'Pluie', icon: <CloudRain size={16} /> },
  { id: 'vent', label: 'Vent', icon: <Wind size={16} /> },
  { id: 'nuit', label: 'Nuit', icon: <Moon size={16} /> },
];

const TIPS = {
  pluie: [
    'Augmentez les distances de sécurité et évitez les bandes blanches',
    'Pneus en bon état et pression vérifiée',
    'Visière anti-buée, gants imperméables',
  ],
  vent: [
    'Adaptez votre vitesse et anticipez les rafales latérales',
    'Restez souple sur le guidon, couvrez le frein',
    'Évitez les dépassements prolongés de poids lourds',
  ],
  nuit: [
    'Conduite défensive, regard loin, feux correctement réglés',
    'Équipement rétro‑réfléchissant, couleurs visibles',
    'Attention animaux et zones non éclairées',
  ],
};

const CHECKLIST = [
  {
    label: 'Chaîne',
    detail: 'Nettoyage + graissage régulier',
    icon: <ChainIcon size={18} />,
    status: 'ok',
  },
  {
    label: 'Pneus',
    detail: 'Usure homogène, pression correcte',
    icon: <CircleDot size={18} />,
    status: 'warn',
  },
  {
    label: 'Freins',
    detail: 'Plaquettes, liquide, course poignée',
    icon: <Disc size={18} />,
    status: 'ok',
    tooltip: 'Remplacement plaquettes: 15–20k km selon usage',
  },
  {
    label: 'Éclairage',
    detail: 'Feux, clignotants, visière propre',
    icon: <Lightbulb size={18} />,
    status: 'ok',
  },
];

function SafetyPrevention() {
  const [active, setActive] = useState('pluie');
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <section className="safety-prevention" aria-labelledby="safety-title">
      <div ref={wrapRef} className="sp-inner section-anim">
        <div className="sp-head">
          <h2 id="safety-title">Sécurité & Prévention</h2>
          <p className="sp-sub">Conseils pratiques et entretien pour rouler serein</p>
        </div>

        <div className="sp-tabs" role="tablist" aria-label="Conseils saisonniers">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`sp-tab ${active === t.id ? 'active' : ''}`}
              role="tab"
              aria-selected={active === t.id}
              onClick={() => setActive(t.id)}
            >
              <span className="sp-tab-icon" aria-hidden>
                {t.icon}
              </span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <ul className="sp-tips sp-tips-grid" aria-live="polite">
          {(TIPS[active] || []).map((tip, i) => (
            <li key={i} className="sp-tip">
              <span className="sp-bullet" aria-hidden>
                ✓
              </span>
              {tip}
            </li>
          ))}
        </ul>

        <div className="sp-timeline" role="list">
          {CHECKLIST.map((item, i) => (
            <div key={i} className="sp-step" role="listitem">
              <div className={`sp-status sp-status-${item.status}`} aria-hidden></div>
              <div
                className="sp-step-card"
                tabIndex={0}
                {...(item.tooltip ? { title: item.tooltip } : {})}
              >
                <div className="sp-step-icon" aria-hidden>
                  {item.icon}
                </div>
                <div className="sp-step-body">
                  <div className="sp-step-title">{item.label}</div>
                  <div className="sp-step-desc">{item.detail}</div>
                </div>
              </div>
              {i < CHECKLIST.length - 1 && <div className="sp-connector" aria-hidden></div>}
            </div>
          ))}
        </div>

        <div className="sp-discount sp-reward">
          <div className="sp-reward-left">
            <div className="sp-discount-badge">-10%</div>
            <div className="sp-discount-text">
              Réduction “Équipement sécurité” (casque, airbag, gants)
            </div>
          </div>
          <div className="sp-reward-icon" aria-hidden>
            <Trophy size={18} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SafetyPrevention;
