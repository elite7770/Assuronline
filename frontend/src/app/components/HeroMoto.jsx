import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const HeroMoto = ({
  title,
  subtitle,
  ctaButton = null,
  backgroundType = 'video', // 'video' or 'image'
  backgroundVideo = null,
  backgroundImage = null,
  className = '',
}) => {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onError = () => {
      console.error('HeroMoto video failed to load');
      setVideoError(true);
    };
    video.addEventListener('error', onError);

    const tryPlay = async () => {
      try {
        video.muted = true;
        await video.play();
      } catch { }
    };
    tryPlay();

    return () => {
      video.removeEventListener('error', onError);
    };
  }, [backgroundVideo]);

  const renderBackground = () => {
    if (!videoError && backgroundType === 'video' && backgroundVideo) {
      return (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Vidéo de présentation assurance moto"
          className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
          ref={videoRef}
          src={backgroundVideo}
          poster={backgroundImage || undefined}
        />
      );
    }

    return (
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundPosition: 'center 30%',
        }}
      />
    );
  };

  return (
    <section className={`relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        {renderBackground()}
        {/* Overlay */}
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl sm:text-2xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {ctaButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link
                to={ctaButton.link}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transform hover:-translate-y-1"
              >
                {ctaButton.label}
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none z-10" />
    </section>
  );
};

export default HeroMoto;
