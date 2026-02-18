import { ShieldCheck, Users, Lightbulb, Heart, Award, User, Star } from 'lucide-react';
import { motion } from 'framer-motion';

function APropos() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          {/* Animated SVG background */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="absolute bottom-0 w-full h-[120%] opacity-30"
          >
            <defs>
              <linearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
            <path
              fill="url(#heroGradient)"
              fillOpacity="0.7"
              d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            >
              <animate
                attributeName="d"
                dur="8s"
                repeatCount="indefinite"
                values="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z;M0,120L60,140C120,160,240,200,360,210C480,220,600,200,720,180C840,160,960,120,1080,110C1200,100,1320,140,1380,160L1440,180L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z;M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
              />
            </path>
          </svg>
          <div className="absolute inset-0 bg-slate-900/80"></div>
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            À propos de AssurOnline
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl text-blue-200 mb-8 font-light"
          >
            Votre mobilité, notre mission. Plus de 20 ans d'expertise pour vous accompagner sur la route.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Protéger votre mobilité est notre mission depuis plus de 20 ans.
          </motion.p>
        </div>
      </section>

      {/* Histoire & Valeurs */}
      <section className="py-24 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Notre Histoire</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              Fondée en 2005, AssurOnline s'est imposée comme un acteur de confiance dans
              l'assurance automobile et moto. Grâce à une expertise pointue et une approche centrée
              sur le client, nous offrons des solutions personnalisées et accessibles.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white pt-8">Nos Valeurs</h2>
            <ul className="grid grid-cols-1 gap-6">
              {[
                { icon: ShieldCheck, title: "Transparence", desc: "Des offres claires et sans surprise.", color: "text-blue-500" },
                { icon: Users, title: "Proximité", desc: "Une assistance humaine 24h/7j.", color: "text-emerald-500" },
                { icon: Lightbulb, title: "Innovation", desc: "Outils digitaux pour simplifier votre quotidien.", color: "text-amber-500" },
                { icon: Heart, title: "Engagement", desc: "Réseau de garages partenaires partout en France.", color: "text-red-500" },
              ].map((val, idx) => (
                <li key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <div className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-800 ${val.color}`}>
                    <val.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white mb-1">{val.title}</strong>
                    <span className="text-slate-600 dark:text-slate-400">{val.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
              <div className="text-center relative z-10">
                <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2">Votre mobilité,</h3>
                <h3 className="text-4xl lg:text-5xl font-bold text-blue-600 mb-6">notre mission</h3>
                <p className="text-xl font-medium text-slate-500 uppercase tracking-widest">20 ans d'expertise</p>
              </div>
            </div>
            {/* Decorative blobs */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Pourquoi nous choisir ?</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Star, title: "Service client 24/7", desc: "Une équipe dédiée, disponible à tout moment pour répondre à vos besoins." },
              { icon: ShieldCheck, title: "Protection optimale", desc: "Des garanties solides et adaptées à chaque profil de conducteur." },
              { icon: Award, title: "Récompenses & confiance", desc: "98% de satisfaction client et de nombreux partenaires agréés." },
            ].map((card, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 bg-blue-50 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <card.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{card.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre équipe */}
      <section className="py-24 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-16">Notre équipe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Marie Dupont", role: "Directrice Générale" },
              { name: "Ali Ben Youssef", role: "Responsable Relation Client" },
              { name: "Julie Martin", role: "Expert Assurance" },
            ].map((member, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-32 h-32 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 border-4 border-white dark:border-slate-900 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <User className="w-12 h-12 text-slate-400" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{member.name}</h4>
                <p className="text-blue-600 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-blue-600 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Award, value: "+20 ans", label: "d'expertise" },
            { icon: ShieldCheck, value: "98%", label: "de satisfaction client" },
            { icon: Heart, value: "500+", label: "partenaires agréés" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center text-white p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
              <stat.icon className="w-10 h-10 mx-auto mb-4 opacity-80" />
              <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
              <p className="text-blue-100 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default APropos;
