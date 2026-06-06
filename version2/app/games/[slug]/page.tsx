"use client";

import { gameProjects, type GameProject } from "../../data/gameProjects";
import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Gamepad2, Play,
  ChevronLeft, ChevronRight, X,
} from "lucide-react";

// ── Shared design tokens ──────────────────────────────────────────────────────
const ACCENT  = "#FF69B4";
const ACCENT2 = "#0ea5e9";
const ACCENT3 = "#a855f7";
const BG      = "#05050f";

const TOOL_ICONS: Record<string, string> = {
  "Figma":       "https://www.google.com/s2/favicons?domain=figma.com&sz=64",
  "ibisPaint X": "https://www.google.com/s2/favicons?domain=ibispaint.com&sz=64",
  "Canva":       "https://www.google.com/s2/favicons?domain=canva.com&sz=64",
  "VS Code":     "https://www.google.com/s2/favicons?domain=code.visualstudio.com&sz=64",
  "Blender":     "https://www.google.com/s2/favicons?domain=blender.org&sz=64",
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
    <Link href="/#games" style={{
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

function Tag_({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      padding: "0.3em 0.85em",
      fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase",
      border: `1px solid ${color}40`, color: color,
      borderRadius: 999, background: `${color}0d`,
      fontFamily: "'Syne', sans-serif",
    }}>{label}</span>
  );
}

function ToolBadge({ tool }: { tool: string }) {
  const icon = TOOL_ICONS[tool];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 7,
      padding: "0.35em 0.9em 0.35em 0.55em",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 999, background: "rgba(255,255,255,0.04)",
    }}>
      {icon && <img src={icon} alt={tool} style={{ width: 18, height: 18, borderRadius: 3, objectFit: "contain" }} />}
      <span style={{ fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>{tool}</span>
    </div>
  );
}

function GalleryThumb({
  src, index, accent, onClick,
}: { src: string | null; index: number; accent: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", aspectRatio: "16/9",
      background: "#111", border: `1px solid ${accent}22`,
      borderRadius: 10, overflow: "hidden", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", transition: "all 0.2s",
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}55`; (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}22`; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
    >
      {src ? (
        <img src={src} alt={`Preview ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: `${accent}44` }}>
          <Gamepad2 size={24} />
          <span style={{ fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Preview {index + 1}</span>
        </div>
      )}
    </button>
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
        <img src={src} alt="Lightbox preview" style={{ maxWidth: "100%", maxHeight: "60vh", objectFit: "contain", borderRadius: 8 }} />
      ) : (
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.9rem", letterSpacing: "0.1em" }}>No image available yet.</div>
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

function VideoPreview({ url, accent }: { url: string | null; accent: string }) {
  const [playing, setPlaying] = useState(false);

  if (url && playing) {
    const ytId = url.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1];
    const embedSrc = ytId ? `https://www.youtube.com/embed/${ytId}?autoplay=1` : url;
    return (
      <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: 16, overflow: "hidden", background: "#000" }}>
        <iframe src={embedSrc} style={{ width: "100%", height: "100%", border: "none" }} allow="autoplay; fullscreen" allowFullScreen />
      </div>
    );
  }

  return (
    <div onClick={() => url && setPlaying(true)} style={{
      width: "100%", aspectRatio: "16/9",
      background: `linear-gradient(135deg, ${accent}12 0%, #0d0d1a 100%)`,
      border: `1px solid ${accent}22`, borderRadius: 16,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16,
      cursor: url ? "pointer" : "default",
      position: "relative", overflow: "hidden",
      transition: "border-color 0.3s",
    }}
    onMouseEnter={e => { if (url) (e.currentTarget as HTMLElement).style.borderColor = `${accent}55`; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}22`; }}
    >
      <div style={{
        position: "absolute", inset: 0, opacity: 0.4,
        backgroundImage: `linear-gradient(${accent}08 1px, transparent 1px), linear-gradient(90deg, ${accent}08 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: url ? accent : "rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: url ? `0 0 30px ${accent}50` : "none",
        position: "relative", zIndex: 1,
      }}>
        <Play size={28} color={url ? "#000" : "rgba(255,255,255,0.2)"} fill={url ? "#000" : "rgba(255,255,255,0.2)"} style={{ marginLeft: 4 }} />
      </div>
      <div style={{
        fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase",
        color: url ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)",
        fontFamily: "'Syne', sans-serif", position: "relative", zIndex: 1,
      }}>
        {url ? "Play Gameplay Preview" : "Video Preview Coming Soon"}
      </div>
      {!url && (
        <div style={{
          fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.15)", position: "relative", zIndex: 1,
        }}>
        </div>
      )}
    </div>
  );
}

// ── Main page component ───────────────────────────────────────────────────────

export default function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [lightboxSrc, setLightboxSrc] = useState<string | null | false>(false);

  const game: GameProject | undefined = gameProjects.find((g: GameProject) => g.slug === slug);

  const statusColors: Record<GameProject["status"], string> = {
    "Completed":   "#22c55e",
    "In Progress": "#f59e0b",
    "Prototype":   ACCENT2,
  };

  const currentIndex = gameProjects.findIndex((g: GameProject) => g.slug === slug);
  const prevGame = gameProjects[currentIndex - 1] ?? null;
  const nextGame = gameProjects[currentIndex + 1] ?? null;

  if (!game) notFound();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${BG}; color: #fff; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${BG}; }
        ::-webkit-scrollbar-thumb { background: ${game!.accent}; border-radius: 2px; }
      `}</style>

      {lightboxSrc !== false && (
        <Lightbox src={lightboxSrc as string | null} onClose={() => setLightboxSrc(false)} />
      )}

      <div style={{ minHeight: "100vh", background: BG, position: "relative", overflow: "hidden" }}>
        <GlowOrb x="5%"  y="20%" color={game!.accent} size={500} />
        <GlowOrb x="90%" y="70%" color={ACCENT3}      size={400} />
        <GlowOrb x="60%" y="10%" color={ACCENT2}      size={300} />

        {/* ── Top Nav ── */}
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

        {/* ── Hero Band ── */}
        <div style={{ padding: "3.5rem 4rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)", maxWidth: 1300, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: "1.5rem",
            fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)", fontFamily: "'Syne', sans-serif",
          }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Home</Link>
            <ChevronRight size={10} />
            <Link href="/#games" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Games</Link>
            <ChevronRight size={10} />
            <span style={{ color: game!.accent }}>{game!.title}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "0.8rem" }}>
            <span style={{
              padding: "0.22em 0.75em", fontSize: "0.6rem", letterSpacing: "0.2em",
              textTransform: "uppercase", color: game!.accent,
              border: `1px solid ${game!.accent}30`, borderRadius: 999,
              background: `${game!.accent}0d`, fontFamily: "'Syne', sans-serif",
            }}>{game!.genre}</span>
            <span style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "0.22em 0.75em", fontSize: "0.6rem", letterSpacing: "0.15em",
              textTransform: "uppercase", color: statusColors[game!.status],
              border: `1px solid ${statusColors[game!.status]}30`, borderRadius: 999,
              background: `${statusColors[game!.status]}0d`,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: statusColors[game!.status] }} />
              {game!.status}
            </span>
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)" }}>{game!.year}</span>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <main style={{
          maxWidth: 1300, margin: "0 auto",
          padding: "3rem 4rem 6rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "start",
        }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

            {/* Game name + tags */}
            <div>
              <h1 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: "clamp(2.2rem, 4vw, 3.8rem)", lineHeight: 1,
                textTransform: "uppercase", letterSpacing: "-0.02em",
                color: "#fff", marginBottom: "1.2rem",
              }}>
                {game!.title}
              </h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {game!.tags.map((tag: string) => (
                  <Tag_ key={tag} label={tag} color={game!.accent} />
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <div style={{
                fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase",
                color: game!.accent, marginBottom: "0.8rem",
                display: "flex", alignItems: "center", gap: 8,
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
              }}>
                <div style={{ width: 20, height: 1, background: game!.accent }} /> About
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.85, fontSize: "0.95rem", fontWeight: 300 }}>
                {game!.desc}
              </p>
              {game!.engine && (
                <p style={{ marginTop: "0.8rem", color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", lineHeight: 1.6 }}>
                  <span style={{ color: game!.accent }}>Engine / Platform:</span> {game!.engine}
                </p>
              )}
            </div>

            {/* Tools Used */}
            <div>
              <div style={{
                fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase",
                color: game!.accent, marginBottom: "0.8rem",
                display: "flex", alignItems: "center", gap: 8,
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
              }}>
                <div style={{ width: 20, height: 1, background: game!.accent }} /> Tools Used
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {game!.tools.map((tool: string) => <ToolBadge key={tool} tool={tool} />)}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ position: "sticky", top: "6rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{
              fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase",
              color: game!.accent, display: "flex", alignItems: "center", gap: 8,
              fontFamily: "'Syne', sans-serif", fontWeight: 700,
            }}>
              <div style={{ width: 20, height: 1, background: game!.accent }} /> Gameplay Preview
            </div>

            <VideoPreview url={game!.videoUrl} accent={game!.accent} />

            {/* Quick stats */}
            <div style={{
              padding: "1.5rem",
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${game!.accent}18`,
              borderRadius: 14,
            }}>
              <div style={{
                fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)", marginBottom: "1.2rem",
                fontFamily: "'Syne', sans-serif",
              }}>Game Details</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {[
                  { label: "Genre",  value: game!.genre },
                  { label: "Status", value: game!.status },
                  { label: "Year",   value: game!.year },
                  { label: "Engine", value: game!.engine || "N/A" },
                  { label: "Tools",  value: game!.tools.join(", ") },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                    <span style={{ fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>{label}</span>
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)", textAlign: "right", lineHeight: 1.4 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* ── Screenshots Gallery ── */}
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0.5rem 4rem 2rem" }}>
          <div style={{
            fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase",
            color: game!.accent, marginBottom: "0.8rem",
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
          }}>
            <div style={{ width: 20, height: 1, background: game!.accent }} /> Screenshots
          </div>
          <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.3rem", scrollBehavior: "smooth" }}>
            {(game!.gallery.length > 0 ? game!.gallery : [null, null, null, null]).map((src: string | null, i: number) => (
              <div key={i} style={{ flex: "0 0 calc(25% - 0.375rem)", minWidth: 0 }}>
                <GalleryThumb
                  src={src}
                  index={i}
                  accent={game!.accent}
                  onClick={() => setLightboxSrc(src)}
                />
              </div>
            ))}
          </div>
          <p style={{ marginTop: "0.5rem", fontSize: "0.62rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
            Click a preview to enlarge
          </p>
        </div>

        {/* ── Prev / Next Navigation ── */}
        {(prevGame || nextGame) && (
          <div style={{
            maxWidth: 1300, margin: "0 auto",
            padding: "3rem 4rem 6rem",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            {prevGame ? (
              <Link href={`/games/${prevGame.slug}`} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "1.2rem 1.5rem",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${prevGame.accent}22`, borderRadius: 14,
                textDecoration: "none", transition: "all 0.3s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${prevGame.accent}55`; (e.currentTarget as HTMLElement).style.background = `${prevGame.accent}08`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${prevGame.accent}22`; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
              >
                <ChevronLeft size={20} color={prevGame.accent} />
                <div>
                  <div style={{ fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>Previous Game</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#fff", fontSize: "0.9rem" }}>{prevGame.title}</div>
                </div>
              </Link>
            ) : <div />}

            {nextGame ? (
              <Link href={`/games/${nextGame.slug}`} style={{
                display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12,
                padding: "1.2rem 1.5rem",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${nextGame.accent}22`, borderRadius: 14,
                textDecoration: "none", transition: "all 0.3s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${nextGame.accent}55`; (e.currentTarget as HTMLElement).style.background = `${nextGame.accent}08`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${nextGame.accent}22`; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
              >
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>Next Game</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#fff", fontSize: "0.9rem" }}>{nextGame.title}</div>
                </div>
                <ChevronRight size={20} color={nextGame.accent} />
              </Link>
            ) : <div />}
          </div>
        )}
      </div>
    </>
  );
}
