import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Aucun élément',
  subtitle = 'Les informations s’afficheront ici dès qu’elles seront disponibles.',
  primary,
  secondary,
}) {
  return (
    <div className="grid place-items-center rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-6 py-10 text-center">
      <Icon className="h-8 w-8 text-[color:var(--color-text-muted)]" aria-hidden />
      <h4 className="mt-3 text-sm font-medium text-[color:var(--color-text-strong)]">{title}</h4>
      {subtitle && <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">{subtitle}</p>}
      {(primary || secondary) && (
        <div className="mt-4 inline-flex gap-2">
          {primary}
          {secondary}
        </div>
      )}
    </div>
  );
}
