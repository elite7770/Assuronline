import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

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
      } catch {}
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
          className="hero-video"
          ref={videoRef}
          src={backgroundVideo}
          poster={backgroundImage || undefined}
        />
      );
    }

    return (
      <div
        className="hero-background-image"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundRepeat: 'no-repeat',
        }}
      />
    );
  };

  return (
    <section className={`hero-section moto ${className}`}>
      {renderBackground()}
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {ctaButton && (
          <Link to={ctaButton.link} className="cta-button">
            {ctaButton.label}
          </Link>
        )}
      </div>
    </section>
  );
};

export default HeroMoto;
