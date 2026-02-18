import Hero from './Hero';
import OffersSection from './OffersSection';
import WhyChooseUsSection from './WhyChooseUsSection';

const AssuranceAuto = () => {
  const heroData = {
    title: 'Assurance Auto adaptée à vos besoins',
    subtitle:
      "Que vous soyez conducteur occasionnel ou quotidien, nous avons la formule qu'il vous faut.",
    ctaButton: {
      label: 'Devis',
      link: '/devis',
    },
    backgroundType: 'video',
    backgroundVideo: '/videos/auto-video.mp4',
    backgroundImage: '/images/home-hero.jpg',
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Hero {...heroData} />
      <OffersSection />
      <WhyChooseUsSection />
    </div>
  );
};

export default AssuranceAuto;
