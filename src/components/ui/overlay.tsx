import React from "react";
import { ChevronDown, MoreVertical, Check } from "lucide-react";

/** Shared tokens */
export const ringIndigo =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1]/40";
export const card =
  "rounded-2xl border border-[#E7E9FF] dark:border-[#2B2F55] bg-white/90 dark:bg-zinc-900/80 backdrop-blur";
export const btnBase =
  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition " + ringIndigo;
export const btnGhost =
  "border border-[#D9DBFF] dark:border-[#30345D] text-[#1B1F3A] dark:text-[#E6E9FF] bg-white/70 dark:bg-zinc-900/40 hover:bg-white/90 dark:hover:bg-zinc-900/60";

/** Prevents filter rows from pushing layout around */
export const FilterBar: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = "", children }) => {
  return (
    <div
      className={
        "flex flex-wrap items-stretch gap-2 " +
        // each child gets a sensible width on small screens & shrinks nicely
        "[&>*]:min-w-[160px] [&>*]:flex-1 sm:[&>*]:flex-none " +
        className
      }
    >
      {children}
    </div>
  );
};

/** Dark-mode friendly dropdown menu */
export const Dropdown: React.FC<{
  triggerClassName?: string;
  menuClassName?: string;
  align?: "left" | "right";
  label?: React.ReactNode;
  children: React.ReactNode;
}> = ({ triggerClassName = "", menuClassName = "", align = "right", label, children }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className={`${btnBase} ${btnGhost} px-2 py-1 ${triggerClassName}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label ?? <MoreVertical className="h-4 w-4" />}
      </button>
      <div
        role="menu"
        className={`absolute ${align === "right" ? "right-0" : "left-0"} mt-2 w-48 z-30 ${card} p-1 transition
        ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"}
        bg-white/95 dark:bg-zinc-900/95 shadow-lg rounded-2xl ${menuClassName}`}
      >
        {children}
      </div>
    </div>
  );
};

export const MenuItem: React.FC<{
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
}> = ({ icon, children, onClick, danger, disabled }) => (
  <button
    role="menuitem"
    disabled={disabled}
    onClick={onClick}
    className={`w-full text-left px-3 py-2 rounded-lg inline-flex items-center gap-2
      hover:bg-white/90 dark:hover:bg-white/[0.08]
      ${danger ? "text-rose-600" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    {icon}
    <span>{children}</span>
  </button>
);

/** Headless, dark-mode Select replacement */
export function SelectMenu<T extends string>({
  value,
  onChange,
  options,
  className = "",
  placeholder = "Select…",
  ariaLabel,
}: {
  value: T | "all";
  onChange: (v: T | "all") => void;
  options: { label: string; value: T | "all" }[];
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const active = options.find((o) => o.value === value);

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        className={`h-11 w-full ${btnBase} ${btnGhost} justify-between`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="truncate">{active?.label ?? placeholder}</span>
        <ChevronDown className="h-4 w-4 opacity-70" />
      </button>
      <div
        role="listbox"
        className={`absolute left-0 right-0 mt-2 z-30 ${card} p-1 transition
        ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"}
        bg-white/95 dark:bg-zinc-900/95 shadow-lg rounded-2xl max-h-64 overflow-auto`}
      >
        {options.map((o) => {
          const selected = o.value === value;
          return (
            <button
              key={String(o.value)}
              role="option"
              aria-selected={selected}
              className={`w-full text-left px-3 py-2 rounded-lg inline-flex items-center gap-2
                hover:bg-white/90 dark:hover:bg-white/[0.08] ${selected ? "font-semibold" : ""}`}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              <Check className={`h-4 w-4 ${selected ? "opacity-100" : "opacity-0"}`} />
              <span className="truncate">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
