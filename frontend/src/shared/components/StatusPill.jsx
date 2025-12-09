
const map = {
  success: [
    'bg-[color:var(--color-success-100)] text-[color:var(--color-success-700)]',
    'dark:bg-[color:var(--color-success-900)]/30 dark:text-[color:var(--color-success-200)]',
  ],
  warn: [
    'bg-[color:var(--color-warning-100)] text-[color:var(--color-warning-800)]',
    'dark:bg-[color:var(--color-warning-900)]/30 dark:text-[color:var(--color-warning-200)]',
  ],
  error: [
    'bg-[color:var(--color-danger-100)] text-[color:var(--color-danger-800)]',
    'dark:bg-[color:var(--color-danger-900)]/30 dark:text-[color:var(--color-danger-200)]',
  ],
  info: [
    'bg-[color:var(--color-primary-100)] text-[color:var(--color-primary-800)]',
    'dark:bg-[color:var(--color-primary-900)]/30 dark:text-[color:var(--color-primary-200)]',
  ],
  neutral: ['bg-[color:var(--chip-bg)] text-[color:var(--color-text-muted)]', ''],
};

export default function StatusPill({ variant = 'neutral', size = 'sm', children }) {
  const px = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]';
  const [a, b] = map[variant] || map.neutral;
  return (
    <span className={['inline-flex items-center rounded-full', px, a, b].join(' ')}>
      {children}
    </span>
  );
}
