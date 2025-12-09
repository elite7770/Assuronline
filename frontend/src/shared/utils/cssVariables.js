import images from '../assets/images';

// Set CSS custom properties for background images
export const setCSSVariables = () => {
  const root = document.documentElement;

  // Set background image variables
  root.style.setProperty('--home-hero-bg', `url(${images.homeHero})`);
};

// Initialize CSS variables when the module is imported
if (typeof document !== 'undefined') {
  setCSSVariables();
}

export default setCSSVariables;
