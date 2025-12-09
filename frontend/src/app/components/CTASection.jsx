import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, TrendingUp, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import '../../assets/styles/cta-section.css';

const CTASection = ({
  title,
  subtitle,
  buttonLabel,
  to,
  benefits = [],
  stats = [],
  highlights = [],
}) => {
  return (
    <section className="cta-hero">
      <div className="cta-gradient" aria-hidden="true" />
      <div className="cta-glass">
        <div className="cta-content">
          <motion.div
            className="cta-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="cta-title">{title}</h2>
            {subtitle && <p className="cta-subtitle">{subtitle}</p>}
          </motion.div>

          {highlights.length > 0 && (
            <motion.div
              className="cta-highlights"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {highlights.map((highlight, index) => (
                <div key={index} className="cta-highlight">
                  <div className="cta-highlight-icon">{highlight.icon}</div>
                  <span className="cta-highlight-text">{highlight.text}</span>
                </div>
              ))}
            </motion.div>
          )}

          {benefits.length > 0 && (
            <motion.div
              className="cta-benefits"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="cta-benefit"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="cta-benefit-icon">{benefit.icon}</div>
                  <div className="cta-benefit-content">
                    <h4 className="cta-benefit-title">{benefit.title}</h4>
                    <p className="cta-benefit-description">{benefit.description}</p>
                    {benefit.badge && (
                      <div className="cta-benefit-badge">
                        <Sparkles className="cta-badge-icon" />
                        <span>{benefit.badge}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {stats.length > 0 && (
            <motion.div
              className="cta-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="cta-stat"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="cta-stat-number">{stat.number}</div>
                  <div className="cta-stat-label">{stat.label}</div>
                  {stat.trend && (
                    <div className="cta-stat-trend">
                      <TrendingUp className="cta-trend-icon" />
                      <span>{stat.trend}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            className="cta-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to={to} className="cta-primary-btn">
                <span>{buttonLabel}</span>
                <ArrowRight className="cta-btn-icon" />
              </Link>
            </motion.div>
            <div className="cta-guarantees">
              <motion.div
                className="cta-guarantee"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.9 }}
              >
                <CheckCircle className="cta-guarantee-icon" />
                <span>Devis gratuit et sans engagement</span>
              </motion.div>
              <motion.div
                className="cta-guarantee"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1.0 }}
              >
                <Clock className="cta-guarantee-icon" />
                <span>Réponse en moins de 2 minutes</span>
              </motion.div>
              <motion.div
                className="cta-guarantee"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1.1 }}
              >
                <Heart className="cta-guarantee-icon" />
                <span>Service client 5 étoiles</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
