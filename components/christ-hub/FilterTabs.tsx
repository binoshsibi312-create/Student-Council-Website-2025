export type FeedFilter = "all" | "department" | "school" | "club" | "admin" | "following";

const TABS: { key: FeedFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "department", label: "Departments" },
  { key: "school", label: "Schools" },
  { key: "club", label: "Clubs & Cells" },
  { key: "admin", label: "Admin" },
];

export default function FilterTabs({
  active,
  onChange,
  followingCount,
}: {
  active: FeedFilter;
  onChange: (filter: FeedFilter) => void;
  followingCount: number;
}) {
  return (
    <div className="flex gap-2 flex-wrap mb-6.5">
      {TABS.map((t) => (
        <button
          key={t.key}
          className={`font-medium text-[0.78rem] py-2 px-4.5 rounded-full cursor-pointer transition-colors border ${
            active === t.key
              ? "bg-raised border-gold/50 text-gold-light"
              : "bg-card border-line text-text-secondary hover:border-fg hover:text-fg"
          }`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
      {followingCount > 0 && (
        <button
          className={`font-medium text-[0.78rem] py-2 px-4.5 rounded-full cursor-pointer transition-colors border ${
            active === "following"
              ? "bg-raised border-gold/50 text-gold-light"
              : "bg-card border-line text-text-secondary hover:border-fg hover:text-fg"
          }`}
          onClick={() => onChange("following")}
        >
          ★ Following ({followingCount})
        </button>
      )}
    </div>
  );
}
