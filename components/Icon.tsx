const PATHS: Record<string, string> = {
  scale: "M12 3v18M7 7L4 13a3 3 0 006 0L7 7zM17 7l-3 6a3 3 0 006 0l-3-6zM4 21h16M7 7h10",
  shield: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z",
  ban: "M6 6l12 12",
  card: "M3 10h18M7 14.5h4",
  medal: "M9 4l3 6 3-6M12 20v-2",
  doc: "M14 3v4h4M9.5 12h5M9.5 15.5h5",
  file: "M14 3v4h4",
  repeat: "M4 9a8 8 0 0114-4M20 15a8 8 0 01-14 4 M18 3v4h-4M6 21v-4h4",
  mic: "M5 11a7 7 0 0014 0M12 18v3",
  access: "M12 8v4l3.5 2M8 14l2-2h4l3 2M9 22l3-6",
  book: "M4 5.5v15M19 19H6.5A2.5 2.5 0 004 21",
  passport: "M8.5 16h7",
  badge: "M9 13.5L7 21l5-3 5 3-2-7.5",
  door: "M14.5 12h.01",
  wash: "M12 9.5v6M8.5 22l3.5-6.5L15.5 22M8 12h8",
  lift: "M12 7l2.2 2.4H9.8zM12 15l2.2-2.4H9.8z",
  pin: "M12 21s7-6.2 7-11.5A7 7 0 105 9.5C5 14.8 12 21 12 21z",
  university: "M3 21h18M4 21V10M20 21V10M2 10l10-6 10 6M6 10v11M18 10v11M10 21v-6h4v6",
  school: "M3 9.5L12 3l9 6.5V21H3z M9 21v-8h6v8",
  vision: "M12 3a9 9 0 000 18M3 12h18",
};

const EXTRA_CIRCLES: Record<string, string | null> = {
  shield: null,
  card: '<rect x="3" y="6" width="18" height="13" rx="1.5"/>',
  medal: '<circle cx="12" cy="14" r="6"/>',
  doc: '<path d="M7 3h7l4 4v14H7z"/>',
  file: '<path d="M7 3h7l4 4v14H7z"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/>',
  access: '<circle cx="12" cy="5" r="1.6"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 016.5 3H19v16H6.5A2.5 2.5 0 004 21z"/>',
  passport: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><circle cx="12" cy="10" r="2.5"/>',
  badge: '<circle cx="12" cy="9" r="5"/>',
  door: '<rect x="6" y="3" width="12" height="18" rx="1"/>',
  wash: '<circle cx="12" cy="7" r="2.5"/>',
  lift: '<rect x="5" y="3" width="14" height="18" rx="1.5"/>',
  ban: '<circle cx="12" cy="12" r="9"/>',
  pin: '<circle cx="12" cy="9.5" r="2.2"/>',
  vision: '<circle cx="12" cy="12" r="9"/>',
};

const DEFAULT_CLASS = "stroke-current fill-none stroke-[1.6] shrink-0 [stroke-linecap:round] [stroke-linejoin:round]";

export default function Icon({
  name,
  size = 20,
  className = DEFAULT_CLASS,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const extra = EXTRA_CIRCLES[name];
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      dangerouslySetInnerHTML={{
        __html: `${extra || ""}<path d="${PATHS[name] || ""}"/>`,
      }}
    />
  );
}
