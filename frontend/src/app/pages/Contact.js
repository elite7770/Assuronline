import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageSquare, FileText, CreditCard, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 5000);
  };

  const quickActions = [
    {
      title: 'Déclarer un sinistre',
      description: 'Soumettez votre déclaration en ligne',
      icon: <FileText className="w-6 h-6 text-white" />,
      link: '/claims',
      gradient: 'from-rose-500 to-red-600',
      shadow: 'shadow-rose-500/20'
    },
    {
      title: 'Espace client',
      description: 'Gérez vos contrats et documents',
      icon: <User className="w-6 h-6 text-white" />,
      link: '/espace-client',
      gradient: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/20'
    },
    {
      title: 'Devis en ligne',
      description: 'Obtenez un devis personnalisé',
      icon: <CreditCard className="w-6 h-6 text-white" />,
      link: '/devis',
      gradient: 'from-emerald-500 to-green-600',
      shadow: 'shadow-emerald-500/20'
    }
  ];

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center border border-slate-700 shadow-2xl"
        >
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Message envoyé !</h2>
          <p className="text-slate-400">Nous vous répondrons dans les plus brefs délais.</p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-900/80 z-10" />
          <img
            src="/images/contact-hero.jpg"
            alt="Contact Background"
            className="w-full h-full object-cover"
            onError={(e) => e.target.style.display = 'none'}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-slate-900/80 z-10" />
        </div>

        <div className="relative z-20 text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Contactez-nous
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-300 mb-8"
          >
            Votre partenaire de confiance pour tous vos besoins d'assurance
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8 text-sm font-medium text-white/80"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Support 24/7
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Réponse &lt; 2h
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              98% Satisfaction
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="-mt-16 relative z-30 px-4 mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.a
                key={index}
                href={action.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${action.gradient} text-white shadow-xl ${action.shadow} hover:-translate-y-1 transition-transform duration-300`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  {action.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                <p className="text-white/80 text-sm">{action.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Nos coordonnées</h2>

              {[
                { icon: <Phone className="w-5 h-5" />, title: 'Téléphone', value: '01 23 45 67 89', sub: 'Lun-Ven: 8h-18h, Sam: 9h-12h' },
                { icon: <Mail className="w-5 h-5" />, title: 'Email', value: 'contact@assuronline.fr', sub: 'Réponse sous 24h' },
                { icon: <MapPin className="w-5 h-5" />, title: 'Adresse', value: '123 Avenue des Champs-Élysées', sub: '75008 Paris, France' },
                { icon: <Clock className="w-5 h-5" />, title: 'Horaires', value: 'Lundi - Vendredi', sub: '8h00 - 18h00' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400 border border-blue-500/20">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 mb-1">{item.title}</h3>
                    <p className="text-white font-medium">{item.value}</p>
                    <span className="text-xs text-slate-500">{item.sub}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Form */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Envoyez-nous un message</h2>
                    <p className="text-slate-400 text-sm">Nous vous répondrons dans les plus brefs délais</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Nom complet *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                        placeholder="Votre nom"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                        placeholder="votre.email@exemple.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Téléphone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                        placeholder="06..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Sujet *</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="general">Demande générale</option>
                        <option value="claim">Déclaration de sinistre</option>
                        <option value="policy">Question sur la police</option>
                        <option value="payment">Paiement et facturation</option>
                        <option value="renewal">Renouvellement de contrat</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="6"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 resize-none"
                      placeholder="Comment pouvons-nous vous aider ?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
