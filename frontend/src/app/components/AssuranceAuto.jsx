import Hero from './Hero';
import OffersSection from './OffersSection';
import WhyChooseUsSection from './WhyChooseUsSection';
import '../../assets/styles/assurance-auto.css';

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

  // Removed unused ctaData demo content

  return (
    <div className="assurance-page">
      <Hero {...heroData} />
      <OffersSection />
      <WhyChooseUsSection />
    </div>
  );
};

export default AssuranceAuto;
