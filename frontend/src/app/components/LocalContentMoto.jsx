import { useEffect, useRef } from 'react';

function LocalContentMoto() {
  const wrapRef = useRef(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) el.classList.add('is-visible');
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <section className="local-content-moto" aria-labelledby="local-title">
      <div ref={wrapRef} className="lc-inner section-anim">
        <h2 id="local-title">Infos locales & Documents requis</h2>
        <div className="lc-grid">
          <div className="lc-card">
            <h3>Zones à risque / Prime par région</h3>
            <p className="lc-note">
              Visuel indicatif – prime susceptible de varier selon profil et garanties.
            </p>
            <div className="lc-riskbar">
              <div className="lc-risk lc-low">Nord</div>
              <div className="lc-risk lc-mid">Centre</div>
              <div className="lc-risk lc-high">Sud</div>
            </div>
          </div>
          <div className="lc-card">
            <h3>Documents requis (Moto)</h3>
            <ul className="lc-docs">
              <li>Carte grise</li>
              <li>Permis A / A2</li>
              <li>Justificatif d'identité</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LocalContentMoto;
