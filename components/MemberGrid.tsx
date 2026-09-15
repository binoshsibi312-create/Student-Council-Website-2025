"use client";

import { useMemo, useState } from "react";
import { COUNCIL_MEMBERS } from "@/lib/members";
import type { CouncilMember } from "@/lib/members";

function memberInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

const selectClass = "w-full rounded-md border border-line bg-white px-3.5 py-2.75 text-[0.8rem] text-ink outline-none transition-colors focus:border-ink";

function MemberCard({ member }: { member: CouncilMember }) {
  return (
    <article className="overflow-hidden rounded-card-md border border-line bg-white transition-all duration-250 hover:-translate-y-0.5 hover:border-gold hover:shadow-card-sm">
      <div className="aspect-[4/5] w-full bg-ink-2">
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="h-full w-full object-cover object-[center_18%]" />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-4 text-center font-display text-[2rem] font-medium text-white/85">
            {memberInitials(member.name)}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-1 font-display text-[0.98rem] font-semibold leading-[1.3] text-ink">{member.name}</h3>
        <a href={`mailto:${member.email}`} className="mb-3 block break-all text-[0.7rem] leading-[1.4] text-gold-dark hover:underline">
          {member.email}
        </a>
        <div className="space-y-1 text-[0.74rem] leading-[1.4] text-text-muted">
          <div><span className="font-semibold text-text-secondary">{member.group === "center" ? "Centre" : "Department"}:</span> {member.group === "center" ? member.center : member.department}</div>
          <div><span className="font-semibold text-text-secondary">{member.group === "center" ? "Scope" : "School"}:</span> {member.group === "center" ? "Centre / Office" : member.school}</div>
          <div><span className="font-semibold text-text-secondary">Campus:</span> {member.campus}</div>
        </div>
      </div>
    </article>
  );
}

export default function MemberGrid() {
  const [school, setSchool] = useState("all");
  const [campus, setCampus] = useState("all");
  const [center, setCenter] = useState("all");
  const [department, setDepartment] = useState("all");
  const [search, setSearch] = useState("");

  const schools = useMemo(() => [...new Set(COUNCIL_MEMBERS.map((m) => m.school).filter(Boolean))].sort(), []);
  const campuses = useMemo(() => [...new Set(COUNCIL_MEMBERS.map((m) => m.campus).filter(Boolean))].sort(), []);
  const centers = useMemo(() => [...new Set(COUNCIL_MEMBERS.map((m) => m.center).filter(Boolean))].sort(), []);
  const departments = useMemo(() => [...new Set(COUNCIL_MEMBERS.map((m) => m.department).filter(Boolean))].sort(), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return COUNCIL_MEMBERS.filter((m) => {
      const matchesSchool = school === "all" || m.school === school;
      const matchesCampus = campus === "all" || m.campus === campus;
      const matchesCenter = center === "all" || m.center === center;
      const matchesDepartment = department === "all" || m.department === department;
      const matchesSearch = !q || m.name.toLowerCase().includes(q);
      return matchesSchool && matchesCampus && matchesCenter && matchesDepartment && matchesSearch;
    });
  }, [campus, center, department, school, search]);

  return (
    <>
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <select className={selectClass} value={school} onChange={(e) => setSchool(e.target.value)}>
          <option value="all">All schools</option>
          {schools.map((value) => (
            <option value={value} key={value}>{value}</option>
          ))}
        </select>
        <select className={selectClass} value={campus} onChange={(e) => setCampus(e.target.value)}>
          <option value="all">All campuses</option>
          {campuses.map((value) => (
            <option value={value} key={value}>{value}</option>
          ))}
        </select>
        <select className={selectClass} value={center} onChange={(e) => setCenter(e.target.value)}>
          <option value="all">All centres</option>
          {centers.map((value) => (
            <option value={value} key={value}>{value}</option>
          ))}
        </select>
        <select className={selectClass} value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="all">All departments</option>
          {departments.map((value) => (
            <option value={value} key={value}>{value}</option>
          ))}
        </select>
        <input
          type="search"
          className={`${selectClass} cursor-text sm:col-span-2 lg:col-span-4`}
          placeholder="Search member name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <p className="text-[0.8rem] text-text-muted mb-6 font-light">
        Showing {filtered.length} of {COUNCIL_MEMBERS.length} University Student Council members
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(235px,100%),1fr))] gap-5">
        {filtered.map((member) => <MemberCard member={member} key={member.email} />)}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-card-md border border-dashed border-line p-8 text-center text-[0.84rem] font-light text-text-muted">
            No members match these filters.
          </div>
        )}
      </div>
    </>
  );
}
