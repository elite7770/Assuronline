import CTASection from './CTASection';

const CTASectionMoto = ({
  title,
  subtitle,
  buttonLabel,
  to,
  benefits = [],
  stats = [],
  highlights = [],
}) => (
  <CTASection
    title={title}
    subtitle={subtitle}
    buttonLabel={buttonLabel}
    to={to}
    benefits={benefits}
    stats={stats}
    highlights={highlights}
  />
);

export default CTASectionMoto;
