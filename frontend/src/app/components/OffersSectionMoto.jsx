import { useState, useEffect } from 'react';
import OfferCardMoto from './OfferCardMoto';
import { getRealOffers } from '../../shared/services/offersService';
import { Shield, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const OffersSectionMoto = () => {
  const [offers, setOffers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' or 'yearly'

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        const realOffers = await getRealOffers('moto');
        setOffers(realOffers);
      } catch (error) {
        console.error('Error loading offers:', error);
        // Fallback to static data if API fails
        setOffers({
          essentiel: {
            title: "Essentiel",
            price: "1,200 MAD",
            priceMonthly: "120 MAD",
            description: "Protection conforme à la loi marocaine",
            benefits: [
              'RC illimitée',
              'Prot. juridique 10K MAD',
              'Garantie conduct. 500 MAD',
              'Assistance 0km',
              'Défense recours',
              'Franchise 200 MAD',
            ],
            popular: false
          },
          confort: {
            title: "Confort",
            price: "2,800 MAD",
            priceMonthly: "280 MAD",
            description: "Protection complète pour le marché marocain",
            benefits: [
              'Toutes garanties Essentiel',
              'Vol et Incendie',
              'Équipements prot. 1K MAD',
              'Bris de glace',
              'Vandalisme',
              'Moto prêt 7j',
            ],
            popular: true
          },
          ultimate: {
            title: "Ultimate",
            price: "4,500 MAD",
            priceMonthly: "450 MAD",
            description: "Protection maximale pour motos de valeur",
            benefits: [
              'Toutes garanties Confort',
              'Protection tous risques',
              'Équipements assurés 3K MAD',
              'Moto prêt 30j',
              'Garantie valeur neuve 2ans',
              'Assistance premium 24h/24',
            ],
            popular: false
          }
        });
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  const getPrice = (offer) => {
    if (billingCycle === 'yearly') {
      return `${offer.price}/an`;
    }
    return `${offer.priceMonthly || (parseInt(offer.price.replace(/[^0-9]/g, '')) / 10).toFixed(0) + ' MAD'}/mois`;
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <section className="relative py-24 px-4 overflow-hidden bg-slate-900 min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement des meilleures offres...</p>
        </div>
      </section>
    );
  }

  if (!offers) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative pt-12 pb-24 px-4 overflow-hidden bg-slate-900"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-sm mb-6"
          >
            <Shield className="w-4 h-4" />
            <span>PROTECTION MOTARD</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            Roulez en Toute Liberté
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg mb-10"
          >
            Des garanties conçues par des motards, pour des motards. Protection optimale pour vous et votre machine.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-6"
          >
            <span className={`text-lg font-medium transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Mensuel</span>

            <button
              onClick={() => setBillingCycle(billingCycle === 'yearly' ? 'monthly' : 'yearly')}
              className={`relative w-16 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${billingCycle === 'yearly' ? 'bg-emerald-500' : 'bg-slate-700'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-0'}`} />
            </button>

            <div className="relative flex items-center gap-3">
              <span className={`text-lg font-medium transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>Annuel</span>
              <span className="absolute -top-6 -right-12 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md transform rotate-12 shadow-lg">
                -20%
              </span>
            </div>
          </motion.div>
        </div>

        {/* Offers Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {Object.values(offers).map((offer, index) => (
            <OfferCardMoto
              key={index}
              title={offer.title}
              price={getPrice(offer)}
              description={offer.description}
              benefits={offer.benefits}
              popular={offer.popular}
            />
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 pt-12 border-t border-slate-800"
        >
          <div className="flex items-center gap-3 text-slate-400">
            <Shield className="w-6 h-6 text-blue-500" />
            <span className="font-medium">Garantie Équipement</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <Zap className="w-6 h-6 text-blue-500" />
            <span className="font-medium">Assistance 0km</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <Award className="w-6 h-6 text-blue-500" />
            <span className="font-medium">Expertise Moto</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default OffersSectionMoto;
