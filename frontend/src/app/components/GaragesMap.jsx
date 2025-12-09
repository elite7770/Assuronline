import { useMemo, useState } from 'react';
import { MapPin, Search, Filter } from 'lucide-react';

const GARAGES = [
  { name: 'Moto Garage Casa', city: 'Casablanca', region: 'Centre', lat: 33.5731, lng: -7.5898 },
  { name: 'Rabat Moto Service', city: 'Rabat', region: 'Nord', lat: 34.0209, lng: -6.8416 },
  { name: 'Marrakech Riders', city: 'Marrakech', region: 'Sud', lat: 31.6295, lng: -7.9811 },
  { name: 'Tanger MotoCare', city: 'Tanger', region: 'Nord', lat: 35.7595, lng: -5.8339 },
  { name: 'Agadir MotoTech', city: 'Agadir', region: 'Sud', lat: 30.4278, lng: -9.5981 },
];

const REGIONS = ['Tous', 'Nord', 'Centre', 'Sud'];

function GaragesMap() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('Tous');

  const filtered = useMemo(() => {
    return GARAGES.filter(
      (g) =>
        (region === 'Tous' || g.region === region) &&
        (g.name.toLowerCase().includes(query.toLowerCase()) ||
          g.city.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, region]);

  return (
    <section className="garages-map" aria-labelledby="garages-title">
      <div className="gm-inner">
        <div className="gm-head">
          <h2 id="garages-title">Garages partenaires moto</h2>
          <div className="gm-controls">
            <div className="gm-search">
              <Search size={16} aria-hidden />
              <input
                type="search"
                placeholder="Rechercher (ville, nom)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Rechercher un garage"
              />
            </div>
            <div className="gm-filters" role="tablist" aria-label="Filtrer par région">
              <span className="gm-filter-icon" aria-hidden>
                <Filter size={14} />
              </span>
              {REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`gm-chip ${region === r ? 'active' : ''}`}
                  role="tab"
                  aria-selected={region === r}
                  onClick={() => setRegion(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="gm-map">
          <div className="gm-placeholder">
            <div className="gm-legend">
              <span className="gm-pin">
                <MapPin size={14} />
              </span>
              <span className="gm-legend-text">Carte interactive (à venir)</span>
            </div>
          </div>
          <ul className="gm-list" aria-label="Liste des garages partenaires">
            {filtered.map((g, i) => (
              <li key={`${g.name}-${i}`} className="gm-item" tabIndex={0}>
                <div className="gm-item-top">
                  <div className="gm-name">{g.name}</div>
                  <span className={`gm-region gm-region-${g.region.toLowerCase()}`}>
                    {g.region}
                  </span>
                </div>
                <div className="gm-city">
                  <MapPin size={14} aria-hidden /> {g.city}
                </div>
              </li>
            ))}
            {filtered.length === 0 && <li className="gm-empty">Aucun garage trouvé.</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default GaragesMap;
