"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, Shield, Star, Award, ChevronRight, Users } from "lucide-react";


// ── PHOTOS [EXTERNAL] ────────────────────────────────────────────────────────

import hackathonHero from "../public/assets/achievements/jdq-thumbnail.png";
import hackathonGallery1 from "../public/assets/achievements/jdq-img1.png";
import hackathonGallery2 from "../public/assets/achievements/jdq-bts1.jpg";
import hackathonGallery3 from "../public/assets/achievements/jdq-bts2.jpg";
import hackathonGallery4 from "../public/assets/achievements/jdq-bts3.jpg";
import hackathonGallery5 from "../public/assets/achievements/jdq-bts4.jpg";
import hackathonGallery6 from "../public/assets/achievements/jdq-bts5.png";
import hackathonGallery7 from "../public/assets/achievements/jdq-bts6.png";
import h4govThumbnail from "../public/assets/achievements/h4g-thumbnail.png";
import h4govGallery1 from "../public/assets/achievements/h4g-img1.png";
import h4govGallery2 from "../public/assets/achievements/h4g-img2.png";
import h4govGallery3 from "../public/assets/achievements/h4g-img3.png";
import h4govGallery4 from "../public/assets/achievements/h4g-img4.png";
import h4govGallery5 from "../public/assets/achievements/h4g-img5.png";
import h4govGallery6 from "../public/assets/achievements/h4g-img6.png";
import aseanConference from "../public/assets/achievements/asean-thumbnail.jpg";
import aseanConferenceGallery1 from "../public/assets/achievements/asean-img1.png";
import aseanConferenceGallery2 from "../public/assets/achievements/asean-img2.png";
import aseanConferenceGallery3 from "../public/assets/achievements/asean-img3.png";
import aseanConferenceGallery4 from "../public/assets/achievements/asean-img4.png";

// ── PHOTOS [INTERNAL] ────────────────────────────────────────────────────────

import deansList from "../public/assets/achievements/dl-thumbnail.png";
import deansListGallery1 from "../public/assets/achievements/dl-img1.png";
import deansListGallery2 from "../public/assets/achievements/dl-img2.png";
import deansListGallery3 from "../public/assets/achievements/dl-img3.png";

const ACCENT = "#FF69B4";
const ACCENT2 = "#e61212";
const ACCENT3 = "#852ed9";

// ── DATA ──────────────────────────────────────────────────────────────────────

export interface Achievement {
  id: number;
  slug: string;
  category: "external" | "school";
  title: string;
  event: string;
  place: string;         // e.g. "1st Place", "Champion", "Member"
  placeRank: number;     // 1 = gold, 2 = silver, 3 = bronze, 0 = participation/member
  date: string;          // e.g. "March 2024"
  shortDesc: string;
  desc: string;          // Full journey / narrative for detail page
  thumbnail: string | null;
  gallery: (string | null)[];
  accent: string;
  icon: "trophy" | "shield" | "star" | "award" | "users";
  organizer?: string;
  team?: string[];
  mentor?: string;
}

export const achievements: Achievement[] = [
  // ── External Competitions ──────────────────────────────────────────────
  {
    id: 1,
    slug: "hackathon-2025",
    category: "external",
    title: "Hackathon 2025",
    event: "Hack The Chain Ep 25.2",
    place: "Champion",
    placeRank: 1,
    date: "July 9-13, 2025",
    shortDesc: "Competed in a regional hackathon, developing a civic tech solution under time pressure.",
    desc: "This was my first taste of competitive problem-solving at a regional level. Our team tackled a real-world civic challenge — designing and prototyping a digital solution within 24 hours. I led the UI/UX design and contributed to the frontend implementation. The pressure was immense, but crossing that finish line taught me more about teamwork and rapid ideation than any classroom ever could.",
    thumbnail: hackathonHero.src,
    gallery: [hackathonHero.src, hackathonGallery1.src, hackathonGallery2.src, hackathonGallery3.src, hackathonGallery4.src, hackathonGallery5.src, hackathonGallery6.src, hackathonGallery7.src],
    accent: "#f59e0b",
    icon: "trophy",
    organizer: "Web3 Pangasinan, Viction Philippines, Makerspace Innovhub OPC",
    team: ["Alentajan, Ana Victoria", "Lavaro, Carl Jacob", "Arive, Zernan Vash", "Serafica, France Aaron", "Gutlay, Clarissa Angel"],
    mentor: "Mr. Marc France Cabiles",
  },
  {
    id: 2,
    slug: "hack4gov-2025",
    category: "external",
    title: "Hack4Gov",
    event: "Hack4Gov Competition",
    place: "Top 6 (Regional Level)",
    placeRank: 0,
    date: "2025",
    shortDesc: "Applied security thinking and design skills to real-world government tech challenges.",
    desc: "Competing in Hack4Gov 2025 was an absolute whirlwind, and walking away with a Top 6 finish at the regional level is something I’m incredibly proud of. Organized by the DICT and NCERT, it wasn't just a standard hackathon—it was a high-stakes regional CTF that forced us to face real-world cyber threats in real-time. My team and I spent hours diving deep into complex web exploits, cryptography, and digital forensics against some of the best student talents in the region. It was the ultimate test of my cybersecurity knowledge, pushing me to think about how data integrity and usability connect in a high-pressure environment. Collaborating on actual government use-cases completely changed how I look at secure systems design, and breaking into the top tier of our region made every single hour of intense problem-solving totally worth it.",
    thumbnail: h4govThumbnail.src,
    gallery: [h4govGallery1.src, h4govGallery2.src, h4govGallery3.src, h4govGallery4.src, h4govGallery5.src, h4govGallery6.src, h4govThumbnail.src],
    accent: ACCENT2,
    icon: "shield",
    organizer: "Department of Information and Communications Technology (DICT)",
    team: ["CyberOwls Beta"],
    mentor: "Mr. Marc France Cabiles",
  },
  {
    id: 3,
    slug: "asean-conference",
    category: "external",
    title: "2025 ASEAN Conference",
    event: "Timpuyog: 2025 ASEAN Conference for Region 1 Higher Education Institutions",
    place: "2nd Runner-Up",
    placeRank: 3,
    date: "September 29, 2025",
    shortDesc: "Presented an SDG-focused tech solution at a regional conference, earning 3rd place.",
    desc: "Participating in the 2025 ASEAN Conference for Region 1 Higher Education Institutions was an unforgettable experience. Our team, JuanDerQuest, developed an innovative tech solution aligned with the Sustainable Development Goals (SDGs) and presented it to a panel of experts and peers from across Southeast Asia. The competition was fierce, with brilliant minds from the region showcasing their ideas. Securing 3rd place was a proud moment that validated our hard work and creativity. It also reinforced my belief in the power of technology to drive positive change on a global scale.",
    thumbnail: aseanConference.src,
    gallery: [aseanConferenceGallery1.src, aseanConferenceGallery2.src, aseanConferenceGallery3.src, aseanConferenceGallery4.src],
    accent: "#22c55e",
    icon: "star",
    organizer: "CHED RO1, in partnership with Pangasinan State University (PSU)",
    team: ["JuanDerQuest"],
    mentor: "Mr. Marc France Cabiles",
  },

  // ── School Achievements ────────────────────────────────────────────────
  {
    id: 4,
    slug: "graphic-artist",
    category: "school",
    title: "Graphic Artist",
    event: "Computer Science and Information Technology Society (CSITS)",
    place: "Member / Officer",
    placeRank: 0,
    date: "2022 – Present",
    shortDesc: "Served as Graphic Artist for the campus IT/CS organization, producing all visual media.",
    desc: "Being the Graphic Artist of CSITS was where everything clicked for me. I was responsible for every piece of visual communication the organization put out — from social media pubmats to event banners to merchandise. Over the years, I developed a personal design language that balanced professionalism with creativity. This role is where I grew from someone who liked making things look nice into someone who understood visual communication at a strategic level.",
    thumbnail: null,
    gallery: [null, null, null, null],
    accent: ACCENT3,
    icon: "users",
    organizer: "Universidad de Dagupan",
  },
  {
    id: 5,
    slug: "dean-lister",
    category: "school",
    title: "Dean's Lister",
    event: "Academic Excellence Award",
    place: "Dean's List",
    placeRank: 2,
    date: "2022 – 2024",
    shortDesc: "Recognized on the Dean's List for academic excellence across multiple semesters.",
    desc: "Balancing design work, organization duties, hackathon prep, and coursework is no small feat — making the Dean's List while doing all of it felt like proof that the grind was worth it. Academic excellence has always mattered to me not as a number, but as evidence that I'm genuinely understanding the foundations that support everything I build.",
    thumbnail: deansList.src,
    gallery: [deansListGallery1.src, deansListGallery2.src, deansListGallery3.src, null],
    accent: ACCENT,
    icon: "award",
    organizer: "Universidad de Dagupan",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function GlowOrb({ x, y, color, size = 400 }: { x: string; y: string; color: string; size?: number }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      width: size, height: size, borderRadius: "50%",
      background: color, filter: "blur(120px)", opacity: 0.1,
      pointerEvents: "none", transform: "translate(-50%, -50%)",
    }} />
  );
}

const ICON_MAP = {
  trophy: Trophy,
  shield: Shield,
  star:   Star,
  award:  Award,
  users:  Users,
};

const PLACE_STYLES: Record<number, { color: string; label: string }> = {
  1: { color: "#fbbf24", label: "Gold" },
  2: { color: "#94a3b8", label: "Silver" },
  3: { color: "#c2813a", label: "Bronze" },
  0: { color: "#6b7280", label: "" },
};

// ── Card ──────────────────────────────────────────────────────────────────────

function AchievementCard({ a }: { a: Achievement }) {
  const [hovered, setHovered] = useState(false);
  const Icon = ICON_MAP[a.icon];
  const placeStyle = PLACE_STYLES[a.placeRank] ?? PLACE_STYLES[0];

  return (
    <Link
      href={`/achievements/${a.slug}`}
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: "relative", borderRadius: 18, overflow: "hidden",
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? a.accent + "66" : a.accent + "22"}`,
        boxShadow: hovered
          ? `0 0 0 1px ${a.accent}44, 0 0 32px ${a.accent}30, 0 0 64px ${a.accent}14, inset 0 0 32px ${a.accent}08`
          : "none",
        transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
        transform: hovered ? "translateY(-6px)" : "none",
        cursor: "pointer",
      }}>
        {/* Glow edge — top */}
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
          background: `linear-gradient(90deg, transparent, ${a.accent}${hovered ? "99" : "33"}, transparent)`,
          transition: "all 0.4s",
        }} />

        {/* Thumbnail / icon area */}
        <div style={{
          width: "100%", height: 160,
          background: `linear-gradient(135deg, ${a.accent}18 0%, #0a0a18 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `radial-gradient(${a.accent}12 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
            opacity: hovered ? 1 : 0.5,
            transition: "opacity 0.4s",
          }} />
          {a.thumbnail ? (
            <img src={a.thumbnail} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: `${a.accent}18`,
              border: `1px solid ${a.accent}33`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", zIndex: 1,
              boxShadow: hovered ? `0 0 24px ${a.accent}44` : "none",
              transition: "box-shadow 0.4s",
            }}>
              <Icon size={28} color={a.accent} />
            </div>
          )}

          {/* Category badge */}
          <div style={{
            position: "absolute", top: 12, left: 12,
            padding: "0.22em 0.7em", fontSize: "0.55rem", letterSpacing: "0.2em",
            textTransform: "uppercase",
            background: "rgba(5,5,15,0.85)", backdropFilter: "blur(8px)",
            border: `1px solid ${a.category === "external" ? "#f59e0b" : ACCENT3}33`,
            color: a.category === "external" ? "#f59e0b" : ACCENT3,
            borderRadius: 999,
            fontFamily: "'Syne', sans-serif",
          }}>
            {a.category === "external" ? "External" : "School"}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "1.2rem 1.3rem 1.4rem" }}>
          {/* Date pill */}
          <div style={{
            display: "inline-flex", alignItems: "center",
            padding: "0.18em 0.7em",
            background: `${a.accent}12`,
            border: `1px solid ${a.accent}30`,
            borderRadius: 999, fontSize: "0.58rem", letterSpacing: "0.14em",
            textTransform: "uppercase", color: a.accent,
            marginBottom: "0.7rem",
            fontFamily: "'Syne', sans-serif",
          }}>{a.date}</div>

          <div style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "0.95rem", color: "#fff", marginBottom: 4,
            textTransform: "uppercase", lineHeight: 1.2,
          }}>{a.title}</div>

          <div style={{
            fontSize: "0.68rem", color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.05em", marginBottom: "0.85rem",
            lineHeight: 1.5,
          }}>{a.event}</div>

          {/* Place badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "0.25em 0.8em",
            border: `1px solid ${placeStyle.color}44`,
            borderRadius: 999, background: `${placeStyle.color}0d`,
            marginBottom: "0.85rem",
          }}>
            {a.placeRank >= 1 && a.placeRank <= 3 && (
              <span style={{ fontSize: "0.75rem" }}>
                {a.placeRank === 1 ? "🥇" : a.placeRank === 2 ? "🥈" : "🥉"}
              </span>
            )}
            <span style={{
              fontSize: "0.62rem", letterSpacing: "0.14em",
              textTransform: "uppercase", color: placeStyle.color,
              fontFamily: "'Syne', sans-serif", fontWeight: 700,
            }}>{a.place}</span>
          </div>

          <p style={{
            fontSize: "0.75rem", color: "rgba(255,255,255,0.4)",
            lineHeight: 1.7, fontWeight: 300, marginBottom: "1rem",
          }}>{a.shortDesc}</p>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: "0.62rem", letterSpacing: "0.15em",
            textTransform: "uppercase", color: a.accent,
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
          }}>
            View Details <ChevronRight size={11} />
          </div>
        </div>

        {/* Glow edge — bottom */}
        <div style={{
          position: "absolute", bottom: 0, left: "20%", right: "20%", height: 1,
          background: `linear-gradient(90deg, transparent, ${a.accent}${hovered ? "66" : "22"}, transparent)`,
          transition: "all 0.4s",
        }} />
      </div>
    </Link>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function HallOfAchievements() {
  const external = achievements.filter(a => a.category === "external");
  const school   = achievements.filter(a => a.category === "school");

  return (
    <section id="achievements" style={{
      padding: "8rem 4rem",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      position: "relative",
      overflow: "hidden",
    }}>
      <GlowOrb x="15%" y="30%" color={ACCENT}  size={400} />
      <GlowOrb x="85%" y="70%" color={ACCENT3} size={350} />
      <GlowOrb x="50%" y="90%" color={ACCENT2} size={300} />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "4rem" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
            fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase",
            color: ACCENT, fontFamily: "'Syne', sans-serif",
          }}>
            <div style={{ width: 24, height: 1, background: ACCENT }} />
            Milestones
          </div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05,
            textTransform: "uppercase", letterSpacing: "-0.02em",
            color: "#fff", marginBottom: "1rem",
          }}>
            Hall of<br /><span style={{ color: ACCENT }}>Achievements.</span>
          </h2>
          <p style={{
            fontSize: "0.9rem", color: "rgba(255,255,255,0.4)",
            maxWidth: 520, lineHeight: 1.8, fontWeight: 300,
          }}>
            Competitions entered, organizations served, and recognition earned — a record of the moments that shaped who I am.
          </p>
        </div>

        {/* External Competitions */}
        <div style={{ marginBottom: "4rem" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: "1.8rem",
          }}>
            <div style={{
              padding: "0.3em 1em",
              background: "#f59e0b14",
              border: "1px solid #f59e0b33",
              borderRadius: 999,
              fontSize: "0.62rem", letterSpacing: "0.22em",
              textTransform: "uppercase", color: "#f59e0b",
              fontFamily: "'Syne', sans-serif", fontWeight: 700,
            }}>
              ⚡ External Competitions
            </div>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, #f59e0b22, transparent)" }} />
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}>
            {external.map(a => <AchievementCard key={a.id} a={a} />)}
          </div>
        </div>

        {/* School Achievements */}
        <div>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: "1.8rem",
          }}>
            <div style={{
              padding: "0.3em 1em",
              background: `${ACCENT3}14`,
              border: `1px solid ${ACCENT3}33`,
              borderRadius: 999,
              fontSize: "0.62rem", letterSpacing: "0.22em",
              textTransform: "uppercase", color: ACCENT3,
              fontFamily: "'Syne', sans-serif", fontWeight: 700,
            }}>
              🎓 School Achievements
            </div>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${ACCENT3}22, transparent)` }} />
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}>
            {school.map(a => <AchievementCard key={a.id} a={a} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
