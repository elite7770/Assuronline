import { FileText, ShieldCheck, Wrench } from 'lucide-react';

function ClaimsJourney() {
  const steps = [
    {
      icon: <FileText size={22} />,
      title: 'Déclarer',
      desc: 'Déclarez votre sinistre en ligne en quelques minutes.',
    },
    {
      icon: <ShieldCheck size={22} />,
      title: 'Évaluer',
      desc: 'Un expert évalue rapidement votre dossier et vous accompagne.',
    },
    {
      icon: <Wrench size={22} />,
      title: 'Réparer',
      desc: 'Réparation dans un garage partenaire avec suivi transparent.',
    },
  ];

  return (
    <section className="claims-journey" aria-labelledby="claims-title">
      <div className="cj-inner section-anim">
        <div className="cj-head">
          <h2 id="claims-title">Parcours sinistre simplifié</h2>
          <p className="cj-sub">Accompagnement de bout en bout, 24/7</p>
        </div>
        <div className="cj-steps">
          {steps.map((s, i) => (
            <div className="cj-step cj-anim" key={i} style={{ animationDelay: `${i * 90}ms` }}>
              <div className="cj-top">
                <span className="cj-number">{String(i + 1).padStart(2, '0')}</span>
                <span className="cj-icon">{s.icon}</span>
              </div>
              <div className="cj-body">
                <div className="cj-title">{s.title}</div>
                <div className="cj-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="cj-footer">
          <div className="cj-badge">Assistance prioritaire</div>
          <div className="cj-help">Déclaration express et suivi en temps réel</div>
        </div>
      </div>
    </section>
  );
}

export default ClaimsJourney;
