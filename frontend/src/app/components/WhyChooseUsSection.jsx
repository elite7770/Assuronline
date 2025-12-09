import { Shield, Clock, Users, Award, Heart, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const WhyChooseUsSection = () => {
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
          Plus de 20 ans d'expérience dans l'assurance auto pour vous offrir le meilleur service
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
            icon: <Shield className="benefit-icon" />,
            title: 'Protection Optimale',
            desc: 'Des garanties solides et adaptées à chaque profil de conducteur pour une sécurité maximale.',
            highlight: 'Sécurité maximale',
          },
          {
            icon: <Clock className="benefit-icon" />,
            title: 'Service 24/7',
            desc: 'Une équipe dédiée disponible à tout moment pour répondre à vos besoins et vos questions.',
            highlight: 'Disponible 24h/24',
          },
          {
            icon: <Users className="benefit-icon" />,
            title: 'Conseillers Experts',
            desc: 'Des professionnels expérimentés qui vous accompagnent dans le choix de votre assurance.',
            highlight: 'Experts auto',
          },
          {
            icon: <Award className="benefit-icon" />,
            title: 'Tarifs Compétitifs',
            desc: "Des prix avantageux grâce à nos partenariats avec les meilleures compagnies d'assurance.",
            highlight: 'Prix avantageux',
          },
          {
            icon: <Heart className="benefit-icon" />,
            title: 'Satisfaction Client',
            desc: '98% de nos clients sont satisfaits de nos services et nous recommandent à leurs proches.',
            highlight: '98% satisfaits',
          },
          {
            icon: <TrendingUp className="benefit-icon" />,
            title: 'Économies Garanties',
            desc: "Nous vous aidons à réduire vos coûts d'assurance tout en maintenant une protection optimale.",
            highlight: 'Économies garanties',
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

export default WhyChooseUsSection;
