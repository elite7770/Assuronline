import { ShieldCheck, Phone, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-blue-400" />,
    title: 'Couverture Complète',
    desc: "Des formules d'assurance personnalisées pour vous protéger dans toutes les situations.",
    gradient: "from-blue-500/20 to-blue-600/5"
  },
  {
    icon: <Phone className="w-8 h-8 text-emerald-400" />,
    title: 'Assistance 24h/7j',
    desc: 'Nos experts sont disponibles à tout moment pour vous accompagner.',
    gradient: "from-emerald-500/20 to-emerald-600/5"
  },
  {
    icon: <Timer className="w-8 h-8 text-amber-400" />,
    title: 'Devis en 3 Minutes',
    desc: 'Obtenez votre estimation rapidement grâce à notre formulaire simplifié.',
    gradient: "from-amber-500/20 to-amber-600/5"
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const FeaturesSection = () => (
  <section className="py-24 bg-slate-900 relative overflow-hidden">
    {/* Top fade transition from hero */}
    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none z-10" />

    {/* Background Pattern */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-900 to-slate-900 pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          Nos Engagements
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 text-lg max-w-2xl mx-auto"
        >
          Des garanties solides pour une mobilité en toute sérénité
        </motion.p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {features.map((f, index) => (
          <motion.div
            key={index}
            variants={item}
            whileHover={{ y: -8 }}
            className={`relative p-8 rounded-2xl border border-slate-800 bg-gradient-to-br ${f.gradient} backdrop-blur-sm hover:border-slate-700 transition-colors group`}
          >
            <div className="w-14 h-14 rounded-xl bg-slate-800/50 flex items-center justify-center mb-6 border border-slate-700 group-hover:scale-110 transition-transform duration-300">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
            <p className="text-slate-400 leading-relaxed">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>

    {/* Bottom fade transition to testimonials */}
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-900/80 pointer-events-none z-10" />
  </section>
);

export default FeaturesSection;
