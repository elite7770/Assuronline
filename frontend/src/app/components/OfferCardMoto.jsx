import { useNavigate } from 'react-router-dom';
import { CheckCircle, Sparkles, TrendingUp, Shield, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const OfferCardMoto = ({ title, price, description, benefits, popular = false }) => {
  const navigate = useNavigate();

  const handleChoosePlan = () => {
    navigate('/devis');
  };

  const isUltimate = title.toLowerCase().includes('ultimate');
  const isConfort = title.toLowerCase().includes('confort');

  const getPlanIcon = () => {
    if (isUltimate) return <Zap className="w-8 h-8 text-amber-400" />;
    if (isConfort) return <Shield className="w-8 h-8 text-blue-400" />;
    return <Shield className="w-8 h-8 text-emerald-400" />;
  };

  const getGradient = () => {
    if (isUltimate) return "from-slate-800 to-slate-900 border-amber-500/30";
    if (popular) return "from-slate-800 to-slate-900 border-blue-500/50";
    return "from-slate-800 to-slate-900 border-slate-700";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative flex flex-col p-8 rounded-3xl border bg-gradient-to-b ${getGradient()} backdrop-blur-xl shadow-2xl overflow-hidden group`}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl shadow-lg flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>LE PLUS POPULAIRE</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 text-left relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-slate-800/50 border border-slate-700 group-hover:scale-110 transition-transform duration-300 ${isUltimate ? 'shadow-amber-500/20 shadow-lg' : ''}`}>
          {getPlanIcon()}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed min-h-[40px]">{description}</p>
      </div>

      {/* Price */}
      <div className="mb-8 text-left">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white tracking-tight">{price.split(' ')[0]}</span>
          <span className="text-lg text-slate-400 font-medium">{price.split(' ').slice(1).join(' ')}</span>
        </div>
      </div>

      {/* Benefits */}
      <ul className="space-y-4 mb-8 flex-grow">
        {benefits.map((benefit, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 text-slate-300 text-sm group/item"
          >
            <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${popular ? 'text-blue-400' : 'text-emerald-400'} group-hover/item:scale-110 transition-transform`} />
            <span className="group-hover/item:text-white transition-colors">{benefit}</span>
          </motion.li>
        ))}
      </ul>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleChoosePlan}
        className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${popular
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
            : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600'
          }`}
      >
        Choisir cette formule
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>

      {/* Background Glow Effects */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-500 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors duration-500 pointer-events-none" />
    </motion.div>
  );
};

export default OfferCardMoto;
