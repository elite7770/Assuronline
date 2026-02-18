import HeroMoto from './HeroMoto';
import OffersSectionMoto from './OffersSectionMoto';
import WhyChooseUsMotoSection from './WhyChooseUsMotoSection';

const AssuranceMoto = () => (
  <div className="min-h-screen bg-slate-900">
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
