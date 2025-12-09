import { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quicks = [
  { k: 'today', label: "Aujourd'hui" },
  { k: '7d', label: '7 jours' },
  { k: '30d', label: '30 jours' },
  { k: 'custom', label: 'Personnalisé' },
];

export default function DateRangePicker({ from, to, onChange }) {
  const [open, setOpen] = useState(false);
  const fromId = useId();
  const toId = useId();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-1.5 text-sm hover:bg-[color:var(--hover)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {from || 'De'} — {to || 'À'}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 z-[var(--z-popover)] mt-2 w-[320px] rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 shadow-lg"
          >
            <div className="mb-2 grid grid-cols-4 gap-1">
              {quicks.map((q) => (
                <button
                  key={q.k}
                  className="rounded border border-[color:var(--color-border)] px-2 py-1.5 text-xs hover:bg-[color:var(--hover)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                  onClick={() => {
                    if (q.k === 'today') {
                      const d = new Date().toISOString().slice(0, 10);
                      onChange?.({ from: d, to: d });
                    } else if (q.k === '7d') {
                      const t = new Date();
                      const f = new Date(Date.now() - 6 * 86400000);
                      onChange?.({
                        from: f.toISOString().slice(0, 10),
                        to: t.toISOString().slice(0, 10),
                      });
                    } else if (q.k === '30d') {
                      const t = new Date();
                      const f = new Date(Date.now() - 29 * 86400000);
                      onChange?.({
                        from: f.toISOString().slice(0, 10),
                        to: t.toISOString().slice(0, 10),
                      });
                    }
                    setOpen(false);
                  }}
                >
                  {q.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs">
                De
                <input
                  id={fromId}
                  type="date"
                  defaultValue={from}
                  className="mt-1 w-full rounded border border-[color:var(--color-border)] bg-transparent px-2 py-1 text-sm focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                />
              </label>
              <label className="text-xs">
                À
                <input
                  id={toId}
                  type="date"
                  defaultValue={to}
                  className="mt-1 w-full rounded border border-[color:var(--color-border)] bg-transparent px-2 py-1 text-sm focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                />
              </label>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button
                className="rounded px-2 py-1 text-xs border border-[color:var(--color-border)] hover:bg-[color:var(--hover)]"
                onClick={() => setOpen(false)}
              >
                Annuler
              </button>
              <button
                className="rounded px-2 py-1 text-xs bg-[color:var(--color-primary-600)] text-white hover:brightness-95"
                onClick={() => {
                  const fromEl = document.getElementById(fromId);
                  const toEl = document.getElementById(toId);
                  onChange?.({ from: fromEl?.value, to: toEl?.value });
                  setOpen(false);
                }}
              >
                Appliquer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
