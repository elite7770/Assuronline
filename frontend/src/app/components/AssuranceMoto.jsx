import HeroMoto from './HeroMoto';
import OffersSectionMoto from './OffersSectionMoto';
import WhyChooseUsMotoSection from './WhyChooseUsMotoSection';

import '../../assets/styles/assurance-moto.css';
import '../../assets/styles/moto-offers-modern.css';

const AssuranceMoto = () => (
  <div className="assurance-page moto">
    <HeroMoto
      title="Assurance Moto Haut de Gamme"
      subtitle="Une couverture complète pour votre moto, pensée pour les vrais passionnés."
      ctaButton={{
        label: 'Devis',
        link: '/devis',
      }}
      backgroundType="video"
      backgroundVideo="/videos/moto-video.mp4"
      backgroundImage="/images/home-hero.jpg"
    />
    <OffersSectionMoto />
    <WhyChooseUsMotoSection />
  </div>
);

export default AssuranceMoto;
