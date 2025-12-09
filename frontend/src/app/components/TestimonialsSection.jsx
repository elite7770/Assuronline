import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sophie D.',
    role: 'Cliente Auto',
    feedback: "Service rapide et professionnel. L'équipe a su répondre à toutes mes attentes.",
    avatarUrl: null,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    name: 'Karim L.',
    role: 'Client Moto',
    feedback: 'Assistance parfaite lors de mon accident. Sérieux et efficacité au top.',
    avatarUrl: null,
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    name: 'Julie P.',
    role: 'Cliente Auto',
    feedback: 'Des tarifs compétitifs et une interface claire. Je recommande sans hésiter !',
    avatarUrl: null,
    gradient: "from-purple-500 to-pink-500"
  },
];

const getInitials = (fullName) => {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts[parts.length - 1]?.[0] || '';
  return (first + last).toUpperCase();
};

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
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 }
};

const TestimonialsSection = () => (
  <section className="py-24 bg-slate-900 relative overflow-hidden">
    {/* Top fade transition from features */}
    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-900/80 to-transparent pointer-events-none z-10" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          Ce que disent nos clients
        </motion.h2>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 100 }}
          viewport={{ once: true }}
          className="h-1 bg-blue-500 mx-auto rounded-full"
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            variants={item}
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 relative group hover:border-slate-600 transition-colors"
          >
            <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-700 group-hover:text-slate-600 transition-colors" />

            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                {getInitials(t.name)}
              </div>
              <div>
                <h4 className="text-white font-bold">{t.name}</h4>
                <p className="text-slate-400 text-sm">{t.role}</p>
              </div>
            </div>

            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>

            <p className="text-slate-300 italic leading-relaxed">
              "{t.feedback}"
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default TestimonialsSection;
