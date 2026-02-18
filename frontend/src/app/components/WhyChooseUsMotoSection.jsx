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
    <section className="py-24 bg-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-900 to-slate-900 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            Pourquoi nous choisir ?
          </motion.h2>
          <motion.p
            className="text-lg text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Des spécialistes moto passionnés à votre service depuis plus de 10 ans
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {[
            {
              icon: <Bike className="w-8 h-8 text-emerald-400" />,
              title: 'Experts Moto Passionnés',
              desc: 'Des conseillers motards qui comprennent votre passion et vos besoins spécifiques.',
              highlight: 'Motards experts',
              gradient: 'from-emerald-500/20 to-emerald-600/5',
              border: 'border-emerald-500/20'
            },
            {
              icon: <Shield className="w-8 h-8 text-blue-400" />,
              title: 'Assistance Moto 24h/24',
              desc: 'Dépannage spécialisé moto en moins de 30 minutes avec remorquage adapté.',
              highlight: '30 min max',
              gradient: 'from-blue-500/20 to-blue-600/5',
              border: 'border-blue-500/20'
            },
            {
              icon: <Gauge className="w-8 h-8 text-violet-400" />,
              title: 'Formules Moto Flexibles',
              desc: 'Des garanties adaptées à tous types de motos : routières, sportives, custom, cross.',
              highlight: 'Tous types',
              gradient: 'from-violet-500/20 to-violet-600/5',
              border: 'border-violet-500/20'
            },
            {
              icon: <Users className="w-8 h-8 text-amber-400" />,
              title: 'Service Client Moto',
              desc: 'Un conseiller moto dédié qui connaît votre véhicule et vos habitudes de conduite.',
              highlight: 'Conseiller moto',
              gradient: 'from-amber-500/20 to-amber-600/5',
              border: 'border-amber-500/20'
            },
            {
              icon: <Award className="w-8 h-8 text-rose-400" />,
              title: 'Tarifs Motards',
              desc: 'Des prix préférentiels pour les motards avec des réductions fidélité et bonus.',
              highlight: 'Prix motards',
              gradient: 'from-rose-500/20 to-rose-600/5',
              border: 'border-rose-500/20'
            },
            {
              icon: <Zap className="w-8 h-8 text-cyan-400" />,
              title: 'Souscription Express',
              desc: 'Devis moto en 2 minutes et souscription en ligne en moins de 10 minutes.',
              highlight: '2 min chrono',
              gradient: 'from-cyan-500/20 to-cyan-600/5',
              border: 'border-cyan-500/20'
            },
          ].map((benefit, idx) => (
            <motion.div
              className={`relative p-8 rounded-2xl bg-gradient-to-br ${benefit.gradient} border ${benefit.border} backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300 group`}
              key={idx}
              variants={item}
            >
              <div className="w-14 h-14 rounded-xl bg-slate-900/50 flex items-center justify-center mb-6 border border-slate-700/50 group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <div className="relative">
                <h4 className="text-xl font-bold text-white mb-3">{benefit.title}</h4>
                <p className="text-slate-400 leading-relaxed mb-4">{benefit.desc}</p>
                <span className="inline-block px-3 py-1 bg-slate-800/50 rounded-full text-xs font-medium text-slate-300 border border-slate-700">
                  {benefit.highlight}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsMotoSection;
