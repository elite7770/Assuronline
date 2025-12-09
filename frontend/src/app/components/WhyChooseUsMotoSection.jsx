import { Bike, Shield, Gauge, Users, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const WhyChooseUsMotoSection = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="why-choose-us">
      <div className="why-choose-header">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Pourquoi nous choisir ?
        </motion.h2>
        <motion.p
          className="why-choose-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Des spécialistes moto passionnés à votre service depuis plus de 10 ans
        </motion.p>
      </div>
      <motion.div
        className="benefits-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {[
          {
            icon: <Bike className="benefit-icon" />,
            title: 'Experts Moto Passionnés',
            desc: 'Des conseillers motards qui comprennent votre passion et vos besoins spécifiques.',
            highlight: 'Motards experts',
          },
          {
            icon: <Shield className="benefit-icon" />,
            title: 'Assistance Moto 24h/24',
            desc: 'Dépannage spécialisé moto en moins de 30 minutes avec remorquage adapté.',
            highlight: '30 min max',
          },
          {
            icon: <Gauge className="benefit-icon" />,
            title: 'Formules Moto Flexibles',
            desc: 'Des garanties adaptées à tous types de motos : routières, sportives, custom, cross.',
            highlight: 'Tous types',
          },
          {
            icon: <Users className="benefit-icon" />,
            title: 'Service Client Moto',
            desc: 'Un conseiller moto dédié qui connaît votre véhicule et vos habitudes de conduite.',
            highlight: 'Conseiller moto',
          },
          {
            icon: <Award className="benefit-icon" />,
            title: 'Tarifs Motards',
            desc: 'Des prix préférentiels pour les motards avec des réductions fidélité et bonus.',
            highlight: 'Prix motards',
          },
          {
            icon: <Zap className="benefit-icon" />,
            title: 'Souscription Express',
            desc: 'Devis moto en 2 minutes et souscription en ligne en moins de 10 minutes.',
            highlight: '2 min chrono',
          },
        ].map((benefit, idx) => (
          <motion.div className="benefit" key={idx} variants={item}>
            <div className="benefit-icon-wrapper">{benefit.icon}</div>
            <div className="benefit-content">
              <h4>{benefit.title}</h4>
              <p>{benefit.desc}</p>
              <span className="benefit-highlight">{benefit.highlight}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default WhyChooseUsMotoSection;
