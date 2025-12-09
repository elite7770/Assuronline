import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const Hero = ({
  title,
  subtitle,
  ctaButton = null,
  backgroundType = 'video', // 'video' or 'image'
  backgroundVideo = null,
  fallbackVideo = null,
  backgroundImage = null,
  className = '',
}) => {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(backgroundVideo || null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;


    const onError = () => {
      console.error('Hero video failed to load');
      // If there is a fallback and we aren't using it yet, switch to it
      if (
        backgroundType === 'video' &&
        backgroundVideo &&
        fallbackVideo &&
        currentSrc !== fallbackVideo
      ) {
        setCurrentSrc(fallbackVideo);
        setVideoError(false);
      } else {
        setVideoError(true);
      }
    };
    video.addEventListener('error', onError);

    // Try to force autoplay in case the browser hesitates
    const tryPlay = async () => {
      try {
        await video.play();
      } catch {
        // Autoplay might be blocked; keep poster visible
      }
    };
    // Ensure muted before attempting play (some browsers require setting it right before play)
    video.muted = true;
    tryPlay();

    return () => {
      video.removeEventListener('error', onError);
    };
  }, [backgroundVideo, fallbackVideo, backgroundType, currentSrc]);

  // When props change, reset currentSrc to primary video
  useEffect(() => {
    setCurrentSrc(backgroundVideo || null);
    setVideoError(false);

  }, [backgroundVideo]);
  const renderBackground = () => {
    if (!videoError && backgroundType === 'video' && currentSrc) {
      return (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Vidéo de présentation assurance auto"
          className="hero-video"
          style={{ zIndex: 0, opacity: 1, objectPosition: 'center 20%' }}
          ref={videoRef}
          onError={() => {
            console.error('Hero video failed to load'); /* handled by listener */
          }}
          src={currentSrc}
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
    <section className={`hero-section auto ${className}`}>
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

export default Hero;
