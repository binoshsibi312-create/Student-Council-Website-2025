import type { Contact } from "@/lib/daksh";

/** Brochure contacts: name, then email and phone as links, in a responsive grid. */
export default function ContactList({ people, className = "" }: { people: Contact[]; className?: string }) {
  return (
    <ul className={`grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-x-8 gap-y-4 ${className}`}>
      {people.map((c) => (
        <li key={c.email} className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[16px] font-bold leading-[1.3] text-fg">{c.name}</span>
          <a href={`mailto:${c.email}`} className="text-[14px] leading-[1.5] break-all text-gold-light hover:underline">
            {c.email}
          </a>
          <a href={`tel:${c.tel}`} className="text-[14px] leading-[1.5] text-fg hover:text-gold-light">
            {c.phone}
          </a>
        </li>
      ))}
    </ul>
  );
}
