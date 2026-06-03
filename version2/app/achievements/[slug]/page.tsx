"use client";

import { achievements, type Achievement } from "../../../components/Achievements";
import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Trophy, Shield, Star, Award, Users,
  ChevronRight, ChevronLeft, X, Calendar, Building2,
} from "lucide-react";

// ── Design tokens (mirrors portfolio) ────────────────────────────────────────
const ACCENT  = "#FF69B4";
const ACCENT2 = "#e61212";
const ACCENT3 = "#a855f7";
const BG      = "#05050f";

const ICON_MAP = { trophy: Trophy, shield: Shield, star: Star, award: Award, users: Users };

const PLACE_META: Record<number, { color: string; emoji: string }> = {
  1: { color: "#fbbf24", emoji: "🥇" },
  2: { color: "#94a3b8", emoji: "🥈" },
  3: { color: "#c2813a", emoji: "🥉" },
  0: { color: "rgba(255,255,255,0.45)", emoji: "🏅" },
};

// ── Sub-components ────────────────────────────────────────────────────────────

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

function BackLink() {
  return (
    <Link href="/#achievements" style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "0.5em 1.2em",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 999, textDecoration: "none",
      color: "rgba(255,255,255,0.55)",
      fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase",
      fontFamily: "'Syne', sans-serif",
      transition: "all 0.2s",
      background: "rgba(255,255,255,0.03)",
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = ACCENT; (e.currentTarget as HTMLElement).style.color = ACCENT; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
    >
      <ArrowLeft size={13} /> Back to Portfolio
    </Link>
  );
}

function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.96)", display: "flex",
      alignItems: "center", justifyContent: "center", padding: "2rem",
    }}>
      {src ? (
        <img src={src} alt="Gallery preview" style={{ maxWidth: "100%", maxHeight: "85vh", objectFit: "contain", borderRadius: 10 }} />
      ) : (
        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.9rem", letterSpacing: "0.1em", fontFamily: "'Syne', sans-serif" }}>
          Photo coming soon.
        </div>
      )}
      <button onClick={onClose} style={{
        position: "absolute", top: "1.2rem", right: "1.2rem",
        background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
        color: "#fff", width: 40, height: 40, borderRadius: "50%", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}><X size={16} /></button>
    </div>
  );
}

function GalleryThumb({ src, index, accent, onClick }: {
  src: string | null; index: number; accent: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      width: "100%", aspectRatio: "4/3",
      background: "#0d0d1a", border: `1px solid ${accent}22`,
      borderRadius: 12, overflow: "hidden", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", transition: "all 0.25s",
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}55`; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${accent}20`; (e.currentTarget as HTMLElement).style.transform = "scale(1.025)"; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}22`; (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
    >
      {src ? (
        <img src={src} alt={`Photo ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: `${accent}40` }}>
          <Trophy size={22} />
          <span style={{ fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>Photo {index + 1}</span>
        </div>
      )}
      {/* Zoom hint */}
      <div style={{
        position: "absolute", inset: 0, background: `${accent}cc`,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: 0, transition: "opacity 0.25s",
        fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase",
        color: "#000", fontFamily: "'Syne', sans-serif", fontWeight: 700,
      }} className="gallery-zoom">↗ Enlarge</div>
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AchievementDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [lightboxSrc, setLightboxSrc] = useState<string | null | false>(false);

  const achievement: Achievement | undefined = achievements.find(a => a.slug === slug);

  if (!achievement) notFound();

  const a = achievement!;
  const Icon = ICON_MAP[a.icon];
  const placeInfo = PLACE_META[a.placeRank] ?? PLACE_META[0];

  const currentIndex = achievements.findIndex(x => x.slug === slug);
  const prevA = achievements[currentIndex - 1] ?? null;
  const nextA = achievements[currentIndex + 1] ?? null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${BG}; color: #fff; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${BG}; }
        ::-webkit-scrollbar-thumb { background: ${a.accent}; border-radius: 2px; }
        .gallery-zoom { pointer-events: none; }
        button:hover .gallery-zoom { opacity: 1 !important; }
      `}</style>

      {lightboxSrc !== false && (
        <Lightbox src={lightboxSrc as string | null} onClose={() => setLightboxSrc(false)} />
      )}

      <div style={{ minHeight: "100vh", background: BG, position: "relative", overflow: "hidden" }}>
        <GlowOrb x="10%"  y="25%" color={a.accent} size={550} />
        <GlowOrb x="88%"  y="60%" color={ACCENT3}  size={380} />
        <GlowOrb x="55%"  y="5%"  color={ACCENT2}  size={280} />

        {/* ── Sticky header ── */}
        <header style={{
          position: "sticky", top: 0, zIndex: 40,
          padding: "1.1rem 4rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(5,5,15,0.8)", backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <BackLink />
          <a href="#hero" className="nav-logo">
            <img src="/assets/logo.png" alt="CA logo" style={{ height: 26, width: "auto", display: "block" }} />
            </a>
        </header>

        {/* ── Hero band ── */}
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "3rem 4rem 0" }}>
          {/* Breadcrumb */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: "2rem",
            fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)", fontFamily: "'Syne', sans-serif",
          }}>
            <Link href="/"         style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Home</Link>
            <ChevronRight size={10} />
            <Link href="/#achievements" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Achievements</Link>
            <ChevronRight size={10} />
            <span style={{ color: a.accent }}>{a.title}</span>
          </div>
        </div>

        {/* ── HERO IMAGE ── */}
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 4rem 3rem" }}>
          <div style={{
            width: "100%", height: "clamp(280px, 42vh, 520px)",
            borderRadius: 20, overflow: "hidden",
            background: `linear-gradient(135deg, ${a.accent}18 0%, #0a0a1a 100%)`,
            border: `1px solid ${a.accent}22`,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
            boxShadow: `0 0 60px ${a.accent}14, 0 0 120px ${a.accent}08`,
          }}>
            {/* Dot pattern */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `radial-gradient(${a.accent}10 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }} />
            {/* Accent line top */}
            <div style={{
              position: "absolute", top: 0, left: "8%", right: "8%", height: 2,
              background: `linear-gradient(90deg, transparent, ${a.accent}88, transparent)`,
              borderRadius: 999,
            }} />

            {a.thumbnail ? (
              <img src={a.thumbnail} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
            ) : (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
                position: "relative", zIndex: 1,
              }}>
                <div style={{
                  width: 100, height: 100, borderRadius: "50%",
                  background: `${a.accent}18`, border: `1px solid ${a.accent}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 0 40px ${a.accent}30`,
                }}>
                  <Icon size={46} color={a.accent} />
                </div>
                <div style={{
                  fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase",
                  color: `${a.accent}88`, fontFamily: "'Syne', sans-serif",
                }}>Hero photo coming soon</div>
              </div>
            )}

            {/* Category & date overlay on image */}
            <div style={{
              position: "absolute", bottom: 20, left: 20,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{
                padding: "0.28em 0.9em",
                background: "rgba(5,5,15,0.85)", backdropFilter: "blur(8px)",
                border: `1px solid ${a.category === "external" ? "#f59e0b" : ACCENT3}33`,
                borderRadius: 999, fontSize: "0.6rem", letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: a.category === "external" ? "#f59e0b" : ACCENT3,
                fontFamily: "'Syne', sans-serif",
              }}>
                {a.category === "external" ? "⚡ External Competition" : "🎓 School Achievement"}
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <main style={{
          maxWidth: 1300, margin: "0 auto",
          padding: "0 4rem 4rem",
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "4rem",
          alignItems: "start",
        }}>
          {/* ── LEFT: narrative ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

            {/* Title + place */}
            <div>
              <h1 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1,
                textTransform: "uppercase", letterSpacing: "-0.02em",
                color: "#fff", marginBottom: "0.6rem",
              }}>{a.title}</h1>
              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", marginBottom: "1.2rem", letterSpacing: "0.04em" }}>
                {a.event}
              </div>

              {/* Place badge — large */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "0.55em 1.4em",
                border: `1.5px solid ${placeInfo.color}55`,
                borderRadius: 999,
                background: `${placeInfo.color}0d`,
                boxShadow: `0 0 20px ${placeInfo.color}18`,
              }}>
                <span style={{ fontSize: "1.4rem" }}>{placeInfo.emoji}</span>
                <span style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  fontSize: "0.9rem", letterSpacing: "0.16em",
                  textTransform: "uppercase", color: placeInfo.color,
                }}>{a.place}</span>
              </div>
            </div>

            {/* My Journey */}
            <div>
              <div style={{
                fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase",
                color: a.accent, marginBottom: "1rem",
                display: "flex", alignItems: "center", gap: 8,
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
              }}>
                <div style={{ width: 20, height: 1, background: a.accent }} /> My Journey
              </div>

              <div style={{
                background: "rgba(255,255,255,0.025)",
                border: `1px solid ${a.accent}18`,
                borderLeft: `3px solid ${a.accent}`,
                borderRadius: "0 12px 12px 0",
                padding: "1.5rem 1.8rem",
              }}>
                <p style={{
                  color: "rgba(255,255,255,0.65)", lineHeight: 1.9,
                  fontSize: "0.95rem", fontWeight: 300,
                  whiteSpace: "pre-wrap",
                }}>{a.desc}</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: details card ── */}
          <div style={{ position: "sticky", top: "6rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{
              padding: "1.6rem",
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${a.accent}20`,
              borderRadius: 16,
              boxShadow: `0 0 40px ${a.accent}0a`,
            }}>
              <div style={{
                fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)", marginBottom: "1.3rem",
                fontFamily: "'Syne', sans-serif",
              }}>Achievement Details</div>

              {[
                { label: "Event",    value: a.event, icon: <Trophy size={13} color={a.accent} /> },
                { label: "Date",     value: a.date,  icon: <Calendar size={13} color={a.accent} />, pill: true },
                { label: "Result",   value: a.place, icon: <span style={{ fontSize: "0.9rem" }}>{placeInfo.emoji}</span> },
                ...(a.organizer ? [{ label: "Organizer", value: a.organizer, icon: <Building2 size={13} color={a.accent} /> }] : []),
                ...(a.team && a.team.length > 0 ? [{ label: "Team", value: a.team.join("\n"), icon: <Users size={13} color={a.accent} /> }] : []),
                ...(a.mentor ? [{ label: "Mentor", value: a.mentor, icon: <Award size={13} color={a.accent} /> }] : []),
                { label: "Category", value: a.category === "external" ? "External Competition" : "School Achievement", icon: <Star size={13} color={a.accent} /> },
              ].map(({ label, value, icon, pill }) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  gap: "1rem", marginBottom: "1rem", paddingBottom: "1rem",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    {icon}
                    <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{label}</span>
                  </div>
                  {pill ? (
                    <span style={{
                      padding: "0.18em 0.7em",
                      background: `${a.accent}12`,
                      border: `1px solid ${a.accent}30`,
                      borderRadius: 999, fontSize: "0.62rem", letterSpacing: "0.12em",
                      textTransform: "uppercase", color: a.accent,
                      fontFamily: "'Syne', sans-serif",
                    }}>{value}</span>
                  ) : (
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.65)", textAlign: "right", lineHeight: 1.7, whiteSpace: "pre-line" }}>{value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* ── Gallery ── */}
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 4rem 3rem" }}>
          <div style={{
            fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase",
            color: a.accent, marginBottom: "1.2rem",
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
          }}>
            <div style={{ width: 20, height: 1, background: a.accent }} /> Behind The Scenes
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.75rem",
          }}>
            {(a.gallery.length > 0 ? a.gallery : [null, null, null, null]).map((src, i) => (
              <GalleryThumb
                key={i}
                src={src}
                index={i}
                accent={a.accent}
                onClick={() => setLightboxSrc(src)}
              />
            ))}
          </div>
          <p style={{
            marginTop: "0.6rem", fontSize: "0.6rem", letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.18)", textAlign: "center",
          }}>Click any photo to enlarge</p>
        </div>

        {/* ── Prev / Next ── */}
        {(prevA || nextA) && (
          <div style={{
            maxWidth: 1300, margin: "0 auto",
            padding: "2rem 4rem 5rem",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            {prevA ? (
              <Link href={`/achievements/${prevA.slug}`} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "1.2rem 1.5rem",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${prevA.accent}22`, borderRadius: 14,
                textDecoration: "none", transition: "all 0.3s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${prevA.accent}55`; (e.currentTarget as HTMLElement).style.background = `${prevA.accent}08`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${prevA.accent}22`; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
              >
                <ChevronLeft size={20} color={prevA.accent} />
                <div>
                  <div style={{ fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>Previous</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#fff", fontSize: "0.88rem" }}>{prevA.title}</div>
                </div>
              </Link>
            ) : <div />}

            {nextA ? (
              <Link href={`/achievements/${nextA.slug}`} style={{
                display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12,
                padding: "1.2rem 1.5rem",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${nextA.accent}22`, borderRadius: 14,
                textDecoration: "none", transition: "all 0.3s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${nextA.accent}55`; (e.currentTarget as HTMLElement).style.background = `${nextA.accent}08`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${nextA.accent}22`; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
              >
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>Next</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#fff", fontSize: "0.88rem" }}>{nextA.title}</div>
                </div>
                <ChevronRight size={20} color={nextA.accent} />
              </Link>
            ) : <div />}
          </div>
        )}
      </div>
    </>
  );
}
