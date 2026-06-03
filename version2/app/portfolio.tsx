"use client";

import { useState, useEffect, type CSSProperties, type ComponentType, type ReactNode } from "react";
import { Code2, Palette, Shield, Gamepad2, ChevronRight, ExternalLink, Mail, MapPin, Phone, Download, X, ChevronLeft, Zap, Award, BookOpen, Trophy, Monitor, Layers, Globe, Lock, Cpu, Play, ArrowRight } from "lucide-react";
import SplashCursor from "../components/SplashCursor";
import Nav from "../components/Nav";
import HallOfAchievements from "../components/Achievements";
import { Canvas } from "@react-three/fiber";
import Lanyard from "../components/Lanyard";
import BorderGlow from "../components/BorderGlow";
import Link from "next/link";
import { gameProjects as importedGameProjects } from "./data/gameProjects";

const ACCENT = "#FF69B4";
const ACCENT2 = "#e61212";
const ACCENT3 = "#852ed9";

type IconComponent = ComponentType<{ size?: number; color?: string }>;

type ProjectCategory = "design" | "print" | "gamedev" | "dev";
type VisibleProjectCategory = "design" | "print";

type FilterKey = VisibleProjectCategory | "all";

interface TimelineItem {
  year: string;
  type: "education" | "design" | "gamedev" | "competition" | "dev";
  icon: IconComponent;
  color: string;
  title: string;
  desc: string;
}

// ── UPDATED: Richer game data structure ──────────────────────────────────────
export interface GameProject {
  id: number;
  slug: string;                  // Used for routing: /games/[slug]
  title: string;
  shortDesc: string;             // Card blurb
  desc: string;                  // Full description for detail page
  genre: string;                 // e.g. "2D Platformer", "Educational Quiz"
  tags: string[];                // Pill-style tags on detail page
  tools: string[];               // Mapped to techStack icons
  engine?: string;               // e.g. "Unity", "Godot", "Custom"
  status: "Completed" | "In Progress" | "Prototype";
  year: string;
  thumbnail: string | null;      // Card image
  gallery: (string | null)[];    // Detail page image gallery (up to 4)
  videoUrl: string | null;       // YouTube/embed URL for video preview
  accent: string;
}

interface Project {
  id: number;
  category: VisibleProjectCategory;
  title: string;
  desc: string;
  tags: string[];
  tools: string[];
  img: string | null;
  accent: string;
}

interface TechStackItem {
  name: string;
  icon: string | null;
  cat: "Design" | "Dev" | "Game Dev" | "Security";
  CustomIcon?: IconComponent;
}

interface GlowOrbProps {
  x: string;
  y: string;
  color: string;
  size?: number;
}

interface SectionLabelProps {
  children: ReactNode;
}

interface SectionTitleProps {
  children: ReactNode;
  style?: CSSProperties;
}

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

// ── DATA ──────────────────────────────────────────────────────────────────────

const timeline: TimelineItem[] = [
  { year: "2022", type: "education", icon: BookOpen, color: "#0ea5e9", title: "Started IT Journey", desc: "Enrolled in Information Technology at Universidad de Dagupan. Discovered the intersection of design and code." },
  { year: "2022", type: "design", icon: Palette, color: "#a855f7", title: "First Design Role", desc: "Joined campus org as graphic designer. Created publication materials, event branding, and social media assets for 1,000+ student community." },
  { year: "2023", type: "education", icon: BookOpen, color: "#0ea5e9", title: "Seminars & Certifications", desc: "Attended tech seminars covering networking fundamentals, cybersecurity basics, and web development frameworks." },
  { year: "2023", type: "gamedev", icon: Gamepad2, color: "#00f5d4", title: "Game Dev Exploration", desc: "Began studying sprite animation, character design mechanics, and game asset pipelines. Created first character sprite sheets." },
  { year: "2023", type: "competition", icon: Trophy, color: "#f59e0b", title: "CodeChella Event Design", desc: "Led full visual identity for CodeChella — a tech-meets-festival booth event. Designed pubmats, banners, and merchandise." },
  { year: "2024", type: "competition", icon: Shield, color: "#ef4444", title: "Hackathon Competitor", desc: "Competed in Hackathon and Hack4Gov, applying problem-solving and security thinking to real-world civic tech challenges." },
  { year: "2024", type: "dev", icon: Code2, color: "#00f5d4", title: "Software & Dev Projects", desc: "Built heritage preservation apps and Laravel-based systems. Bridged UI/UX design with backend development." },
  { year: "2024", type: "education", icon: Award, color: "#0ea5e9", title: "Advanced Certifications", desc: "Completed coursework in networking protocols, cybersecurity practices, and full-stack development concepts." },
];

// ── Design & Print projects only ─────────────────────────────────────────────
const projects: Project[] = [
  {
    id: 1, category: "design",
    title: "Happy New Year 2025",
    desc: "Official digital publication material welcoming 2025. Created for Universidad de Dagupan's social media platforms — festive greeting reinforcing the org's digital presence and institutional pride.",
    tags: ["Publication", "Social Media", "Visual Design"],
    tools: ["Canva"],
    img: "/assets/projects/digital/1.png",
    accent: "#a855f7",
  },
  {
    id: 2, category: "design",
    title: "CodeChella",
    desc: "Publication material and booth banner for CodeChella — a tech-festival event. Surreal cosmic-desert aesthetic with liquid-chrome typography, disco ball, and floating musical elements. Drove both digital engagement and physical foot traffic.",
    tags: ["Digital", "Visual Design", "Booth Banner"],
    tools: ["Canva", "ibisPaint X"],
    img: "assets/projects/digital/8.png",
    accent: "#00f5d4",
  },
  {
    id: 3, category: "print",
    title: "Igniting the Streak",
    desc: "STS project print design. One of my strongest personal works — balancing editorial layout with bold visual hierarchy.",
    tags: ["Print", "Poster", "Editorial"],
    tools: ["Canva"],
    img: "assets/projects/print/1.png",
    accent: "#f59e0b",
  },
  {
    id: 4, category: "design",
    title: "Intrams Schedule Posting",
    desc: "Digital schedule posting for Intramurals. Completed in half a day — clean hierarchy, bold type, easy scanability at a glance.",
    tags: ["Digital", "Pubmat", "Social Graphics"],
    tools: ["Canva"],
    img: "assets/projects/digital/5.png",
    accent: "#0ea5e9",
  },
  {
    id: 5, category: "design",
    title: "Mascot Design",
    desc: "Original mascot character design for campus organization branding. From concept sketches to final vector with usage guidelines.",
    tags: ["Branding", "Mascot", "Illustration"],
    tools: ["ibisPaint X", "Canva"],
    img: null,
    accent: "#a855f7",
  },
];

// ── Game projects — imported from data file and exported so game detail pages can import them ─────────────
export const gameProjects: GameProject[] = importedGameProjects;

const techStack: TechStackItem[] = [
  { name: "Adobe Illustrator", icon: "https://www.adobe.com/content/dam/cc/icons/ai.svg", cat: "Design" },
  { name: "Photoshop", icon: "https://www.adobe.com/content/dam/cc/icons/psicon.svg", cat: "Design" },
  { name: "Canva", icon: "https://www.google.com/s2/favicons?domain=canva.com&sz=64", cat: "Design" },
  { name: "Figma", icon: "https://www.google.com/s2/favicons?domain=figma.com&sz=64", cat: "Design" },
  { name: "ibisPaint X", icon: "https://www.google.com/s2/favicons?domain=ibispaint.com&sz=64", cat: "Design" },
  { name: "PHP / Laravel", icon: "https://www.google.com/s2/favicons?domain=laravel.com&sz=64", cat: "Dev" },
  { name: "JavaScript", icon: "https://www.google.com/s2/favicons?domain=javascript.info&sz=64", cat: "Dev" },
  { name: "GitHub", icon: "https://www.google.com/s2/favicons?domain=github.com&sz=64", cat: "Dev" },
  { name: "Blender", icon: "https://www.google.com/s2/favicons?domain=blender.org&sz=64", cat: "Game Dev" },
  { name: "Networking", icon: null, cat: "Security", CustomIcon: Globe },
  { name: "Cyber Security", icon: null, cat: "Security", CustomIcon: Lock },
  { name: "Linux / CLI", icon: null, cat: "Security", CustomIcon: Cpu },
];

const catConfig: Record<FilterKey, { label: string; color: string }> = {
  all:    { label: "All",    color: "#ffffff" },
  design: { label: "Design", color: "#a855f7" },
  print:  { label: "Print",  color: "#f59e0b" },
};

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function Noise() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.025,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    }} />
  );
}

function GlowOrb({ x, y, color, size = 400 }: GlowOrbProps) {
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      width: size, height: size,
      borderRadius: "50%",
      background: color,
      filter: "blur(120px)",
      opacity: 0.12,
      pointerEvents: "none",
      transform: "translate(-50%, -50%)",
    }} />
  );
}

function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
      fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase",
      color: ACCENT, fontFamily: "'Syne', sans-serif",
    }}>
      <div style={{ width: 24, height: 1, background: ACCENT }} />
      {children}
    </div>
  );
}

function SectionTitle({ children, style }: SectionTitleProps) {
  return (
    <h2 style={{
      fontFamily: "'Syne', sans-serif", fontWeight: 800,
      fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05,
      textTransform: "uppercase", letterSpacing: "-0.02em",
      color: "#fff", marginBottom: "1.5rem", ...style,
    }}>{children}</h2>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "0 4rem", position: "relative", overflow: "hidden",
    }}>
      <GlowOrb x="10%" y="50%" color={ACCENT} size={600} />
      <GlowOrb x="70%" y="30%" color={ACCENT2} size={500} />
      <GlowOrb x="85%" y="75%" color={ACCENT3} size={400} />

      <div style={{
        position: "absolute", fontFamily: "'Syne', sans-serif", fontWeight: 800,
        fontSize: "clamp(8rem, 18vw, 18rem)", color: "transparent",
        WebkitTextStroke: "1px rgba(255,255,255,0.04)",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        whiteSpace: "nowrap", userSelect: "none", pointerEvents: "none", letterSpacing: "-0.05em",
      }}>CREATOR</div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 780 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: "1.8rem",
          padding: "0.35em 1em", border: "2px solid rgba(255, 105, 180,0.3)",
          borderRadius: 999, fontSize: "0.68rem", letterSpacing: "0.2em",
          textTransform: "uppercase", color: "white",
          background: "rgba(0,245,212,0.06)",
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%", background: "#22c55e", flexShrink: 0,
            boxShadow: "0 0 0 3px rgba(34,197,94,0.25)",
            animation: "pulse 2s ease-in-out infinite",
          }} />
          Available for Internship
        </div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: "clamp(3rem, 7vw, 7rem)", lineHeight: 0.92,
          textTransform: "uppercase", letterSpacing: "-0.03em", color: "#fff",
          marginBottom: "1rem",
        }}>
          Clarissa<br />
          <span style={{ color: ACCENT }}>Angel</span>
        </h1>

        <p style={{
          fontFamily: "'Proxima Nova', sans-serif", fontSize: "1.1rem", lineHeight: 1.7,
          color: "rgba(255,255,255,0.5)", maxWidth: 520, marginBottom: "0.6rem",
        }}>
          Designing Pixels. Building Systems. Securing Networks.
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "2.5rem", marginTop: "1rem" }}>
          {[
            { icon: Palette,  label: "Visual Design",  color: ACCENT3 },
            { icon: Gamepad2, label: "Game Dev",        color: "#e67c2c" },
            { icon: Shield,   label: "Cyber Security",  color: ACCENT2 },
            { icon: Code2,    label: "Software Dev",    color: ACCENT },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "0.4em 0.9em", border: `1px solid ${color}33`,
              borderRadius: 999, fontSize: "0.7rem", letterSpacing: "0.1em",
              color, background: `${color}11`,
            }}>
              <Icon size={11} /> {label}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <a href="#projects" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "0.8em 2em",
            background: `linear-gradient(135deg, ${ACCENT}, #ff1493)`,
            color: "#000",
            fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase",
            textDecoration: "none", fontFamily: "'Syne', sans-serif", fontWeight: 700,
            borderRadius: 4, transition: "all 0.3s ease",
            boxShadow: `0 0 20px ${ACCENT}40, 0 0 40px ${ACCENT}20`,
            border: `1px solid ${ACCENT}80`,
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 30px ${ACCENT}60, 0 0 60px ${ACCENT}40`; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 20px ${ACCENT}40, 0 0 40px ${ACCENT}20`; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            View My Work <ChevronRight size={14} />
          </a>
          <a href="#contact" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "0.8em 2em",
            background: "transparent",
            border: `2px solid ${ACCENT}`,
            color: ACCENT,
            fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase",
            textDecoration: "none", borderRadius: 4, transition: "all 0.3s ease",
            boxShadow: `0 0 15px ${ACCENT}30`,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${ACCENT}, #ff1493)`; e.currentTarget.style.color = "#000"; e.currentTarget.style.boxShadow = `0 0 25px ${ACCENT}50`; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = ACCENT; e.currentTarget.style.boxShadow = `0 0 15px ${ACCENT}30`; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Get In Touch
          </a>
        </div>
      </div>

      <div className="relative z-0 w-full h-150 flex justify-center items-center scale-100 origin-center">
        <Lanyard position={[0, 0, 12]} gravity={[0, -40, 0]} />
      </div>

      <div style={{
        position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.3)",
      }}>
        <div style={{ width: 1, height: 48, background: `linear-gradient(to bottom, ${ACCENT}, transparent)` }} />
        SCROLL
      </div>
    </section>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────

function About() {
  return (
    <section id="about" style={{ padding: "8rem 4rem", position: "relative", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <GlowOrb x="90%" y="20%" color={ACCENT3} size={400} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center", maxWidth: 1200, margin: "0 auto" }}>
        <div>
          <SectionLabel>About</SectionLabel>
          <SectionTitle>Generalist<br /><span style={{ color: ACCENT }}>Creator.</span></SectionTitle>
          <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.9, fontSize: "0.95rem", marginBottom: "1.2rem", fontWeight: 300 }}>
            Hi, I'm Clarissa Angel — a multidisciplinary CS student from the Philippines. I sit at the crossroads of Visual Design, Game Development, and Cybersecurity/Software Engineering.
          </p>
          <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.9, fontSize: "0.95rem", fontWeight: 300 }}>
            Over 3 years, I've gone from crafting event branding for school organization to competing in hackathons, building full-stack systems, and exploring game asset pipelines. I don't fit in one box — and I think that's a superpower.
          </p>

          <div style={{ display: "flex", gap: "2rem", marginTop: "2.5rem" }}>
            {[
              { num: "100%", label: "Self-Taught" },
              { num: "100+", label: "Cups of Coffee" },
              { num: "3 yrs", label: "Experience" },
            ].map(({ num, label }) => (
              <div key={label} style={{ borderLeft: `2px solid ${ACCENT}`, paddingLeft: "1rem" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                  {num.includes("%") ? <>{num.replace("%","")} <span style={{ color: ACCENT }}>%</span></> :
                   num.includes("+") ? <>{num.replace("+","")} <span style={{ color: ACCENT }}>+</span></> :
                   num}
                </div>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginTop: 4, fontFamily: "'Syne', sans-serif" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {[
            {
              icon: Palette, title: "Visual Design",
              desc: "Brand identity, print, social media, mascot design",
              color: ACCENT3,
              glowColor: "271 66 51",
              colors: [ACCENT3, "#c084fc", "#f472b6"],
            },
            {
              icon: Gamepad2, title: "Game Dev",
              desc: "Sprite sheets, character animation, game assets",
              color: "#e67c2c",
              glowColor: "25 76 54",
              colors: ["#e67c2c", "#fb923c", "#fbbf24"],
            },
            {
              icon: Shield, title: "Cyber Security",
              desc: "Hackathons, Hack4Gov, networking protocols",
              color: ACCENT2,
              glowColor: "0 88 46",
              colors: [ACCENT2, "#f87171", "#fb923c"],
            },
            {
              icon: Code2, title: "Software Dev",
              desc: "Laravel, PHP, full-stack heritage apps",
              color: ACCENT,
              glowColor: "330 100 70",
              colors: [ACCENT, "#ff1493", "#c026d3"],
            },
          ].map(({ icon: Icon, title, desc, color, glowColor, colors }) => (
            <BorderGlow
              key={title}
              edgeSensitivity={25}
              glowColor={glowColor}
              backgroundColor="rgba(10,10,20,0.6)"
              borderRadius={12}
              glowRadius={36}
              glowIntensity={1.1}
              coneSpread={28}
              animated={false}
              colors={colors}
              fillOpacity={0.3}
            >
              <div style={{ padding: "1.5rem" }}>
                <Icon size={20} color={color} style={{ marginBottom: 10 }} />
                <div style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 700,
                  fontSize: "0.85rem", color: "#fff", marginBottom: 6,
                }}>
                  {title}
                </div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                  {desc}
                </div>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PROJECT MODAL ─────────────────────────────────────────────────────────────

function ProjectModal({ project, onClose, onPrev, onNext }: ProjectModalProps) {
  const [lightbox, setLightbox] = useState(false);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") lightbox ? setLightbox(false) : onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [lightbox, onClose, onPrev, onNext]);

  if (!project) return null;
  return (
    <>
      {lightbox && (
        <div onClick={() => setLightbox(false)} style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.96)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem",
        }}>
          {project.img ? (
            <img src={project.img} alt={project.title} style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain", borderRadius: 8 }} />
          ) : null}
          <button onClick={() => setLightbox(false)} style={{
            position: "absolute", top: "1.2rem", right: "1.2rem",
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff", width: 40, height: 40, borderRadius: "50%", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><X size={16} /></button>
        </div>
      )}

      <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem",
      }}>
        <div style={{
          background: "#0a0a12", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20, width: "100%", maxWidth: 860,
          display: "grid", gridTemplateColumns: "1fr 1fr",
          overflow: "hidden", maxHeight: "90vh",
        }}>
          <div style={{
            background: "#111", display: "flex", alignItems: "center", justifyContent: "center",
            minHeight: 300, position: "relative", overflow: "hidden",
          }}>
            {project.img ? (
              <img src={project.img} alt={project.title}
                onClick={() => setLightbox(true)}
                style={{ width: "100%", height: "auto", maxHeight: "85vh", objectFit: "contain", display: "block", cursor: "zoom-in" }}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.2)", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                <Layers size={48} />
                NO IMAGE YET
              </div>
            )}
          </div>

          <div style={{ padding: "2rem 1.8rem", display: "flex", flexDirection: "column", overflowY: "auto" }}>
            <button onClick={onClose} style={{
              alignSelf: "flex-end", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)", width: 32, height: 32, borderRadius: "50%", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem",
            }}><X size={14} /></button>

            <div style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: project.accent, marginBottom: 6 }}>
              {catConfig[project.category]?.label || project.category}
            </div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#fff", marginBottom: "1rem", lineHeight: 1.1, textTransform: "uppercase" }}>
              {project.title}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.9, fontWeight: 300, flex: 1 }}>{project.desc}</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "1.2rem" }}>
              {project.tags.map(t => (
                <span key={t} style={{ padding: "0.25em 0.8em", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", borderRadius: 999 }}>{t}</span>
              ))}
            </div>

            {project.tools?.length > 0 && (
              <div style={{ marginTop: "1.2rem" }}>
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: project.accent, marginBottom: 8, fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>Tools Used</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {project.tools.map(tool => {
                    const match = techStack.find(t => t.name.toLowerCase() === tool.toLowerCase());
                    return (
                      <div key={tool} style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "0.25em 0.75em 0.25em 0.4em",
                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999,
                        background: "rgba(255,255,255,0.04)",
                      }}>
                        {match?.icon ? <img src={match.icon} alt={tool} style={{ width: 16, height: 16, borderRadius: 3 }} /> : null}
                        <span style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{tool}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: "1.5rem" }}>
              <button onClick={onPrev} style={{ flex: 1, padding: "0.5em", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)", borderRadius: 999, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <ChevronLeft size={12} /> Prev
              </button>
              <button onClick={onNext} style={{ flex: 1, padding: "0.5em", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)", borderRadius: 999, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                Next <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── PROJECTS (Design & Print only) ───────────────────────────────────────────

function Projects() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const filtered = filter === "all" ? projects : projects.filter(p => p.category === filter);
  const activeProject = modalIdx !== null ? filtered[modalIdx] : null;

  return (
    <section id="projects" style={{ padding: "8rem 4rem", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative" }}>
      <GlowOrb x="80%" y="60%" color={ACCENT} size={350} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <SectionLabel>Selected Work</SectionLabel>
            <SectionTitle style={{ marginBottom: 8 }}>My Projects.</SectionTitle>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", minHeight: "1.2em" }}>
              {filter !== "all" ? `Showing ${filtered.length} of ${projects.length}` : ""}
            </p>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.entries(catConfig).map(([key, { label, color }]) => (
              <button key={key} onClick={() => setFilter(key as FilterKey)} style={{
                padding: "0.4em 1.1em", fontSize: "0.7rem", letterSpacing: "0.12em",
                textTransform: "uppercase", borderRadius: 999, cursor: "pointer",
                border: filter === key ? `1px solid ${color}` : "1px solid rgba(255,255,255,0.12)",
                background: filter === key ? `${color}18` : "transparent",
                color: filter === key ? color : "rgba(255,255,255,0.4)",
                transition: "all 0.2s",
              }}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{ columns: 3, columnGap: "1rem" }}>
          {filtered.map((p, i) => (
            <div key={p.id} onClick={() => setModalIdx(i)}
              style={{
                breakInside: "avoid", marginBottom: "1rem", borderRadius: 14, overflow: "hidden",
                background: "rgba(255,255,255,0.03)", border: `1px solid ${p.accent}22`,
                cursor: "pointer", transition: "all 0.3s", position: "relative",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = `${p.accent}55`; e.currentTarget.style.boxShadow = `0 16px 48px ${p.accent}18`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = `${p.accent}22`; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: "100%", height: [200,290,170,260,195][i % 5], background: "#111", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                {p.img ? (
                  <img src={p.img} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <div style={{ color: `${p.accent}44`, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <Layers size={36} />
                    <span style={{ fontSize: "0.65rem", letterSpacing: "0.12em", color: `${p.accent}66`, textTransform: "uppercase" }}>No Image</span>
                  </div>
                )}
                <div style={{
                  position: "absolute", inset: 0, background: `${p.accent}dd`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0, transition: "opacity 0.3s",
                  fontFamily: "'Syne', sans-serif", fontSize: "0.75rem", fontWeight: 700,
                  letterSpacing: "0.15em", textTransform: "uppercase", color: "#000",
                }} className="overlay">↗ VIEW PROJECT</div>
              </div>
              <div style={{ padding: "0.9rem 1.1rem" }}>
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: p.accent, marginBottom: 4 }}>
                  {catConfig[p.category]?.label}
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#fff" }}>{p.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setModalIdx(null)}
          onPrev={() => setModalIdx(cur => cur !== null ? (cur - 1 + filtered.length) % filtered.length : null)}
          onNext={() => setModalIdx(cur => cur !== null ? (cur + 1) % filtered.length : null)}
        />
      )}
    </section>
  );
}

// ── GAMES SECTION (Bento Grid) ────────────────────────────────────────────────

function Games() {
  const statusColors: Record<GameProject["status"], string> = {
    "Completed":   "#22c55e",
    "In Progress": "#f59e0b",
    "Prototype":   ACCENT2,
  };

  return (
    <section id="games" style={{ padding: "8rem 4rem", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative" }}>
      <GlowOrb x="20%" y="50%" color="#00f5d4" size={450} />
      <GlowOrb x="85%" y="20%" color={ACCENT3} size={300} />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel>Game Dev</SectionLabel>
        <SectionTitle>
          Games &<br /><span style={{ color: "#FF69B4" }}>Interactive</span> Work.
        </SectionTitle>

        {/* Bento grid — first card spans 2 cols, rest normal */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "auto",
          gap: "1rem",
        }}>
          {gameProjects.map((game, i) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              style={{
                gridColumn: i === 0 ? "span 2" : "span 1",
                textDecoration: "none",
                display: "block",
                borderRadius: 18,
                overflow: "hidden",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${game.accent}22`,
                transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
                position: "relative",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                (e.currentTarget as HTMLElement).style.borderColor = `${game.accent}55`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 24px 60px ${game.accent}20`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.borderColor = `${game.accent}22`;
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Thumbnail */}
              <div style={{
                width: "100%",
                height: i === 0 ? 280 : 200,
                background: `linear-gradient(135deg, ${game.accent}18 0%, #111 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden",
              }}>
                {game.thumbnail ? (
                  <img src={game.thumbnail} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <>
                    {/* Decorative background pattern */}
                    <div style={{
                      position: "absolute", inset: 0,
                      backgroundImage: `radial-gradient(${game.accent}15 1px, transparent 1px)`,
                      backgroundSize: "24px 24px",
                    }} />
                    <Gamepad2 size={i === 0 ? 56 : 40} color={`${game.accent}55`} style={{ position: "relative", zIndex: 1 }} />
                  </>
                )}

                {/* Status badge */}
                <div style={{
                  position: "absolute", top: 14, left: 14,
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "0.28em 0.8em",
                  background: "rgba(5,5,15,0.85)", backdropFilter: "blur(8px)",
                  border: `1px solid ${statusColors[game.status]}44`,
                  borderRadius: 999, fontSize: "0.6rem", letterSpacing: "0.15em",
                  textTransform: "uppercase", color: statusColors[game.status],
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusColors[game.status], flexShrink: 0 }} />
                  {game.status}
                </div>

                {/* Arrow on hover */}
                <div style={{
                  position: "absolute", bottom: 14, right: 14,
                  width: 36, height: 36, borderRadius: "50%",
                  background: game.accent,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0, transition: "opacity 0.3s",
                }} className="game-arrow">
                  <ArrowRight size={14} color="#000" />
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: "1.2rem 1.4rem 1.4rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: game.accent }}>{game.genre}</div>
                  <div style={{ fontSize: "0.58rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)" }}>{game.year}</div>
                </div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: i === 0 ? "1.3rem" : "1rem", color: "#fff", marginBottom: 8, lineHeight: 1.15, textTransform: "uppercase" }}>
                  {game.title}
                </h3>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, fontWeight: 300, marginBottom: "1rem" }}>
                  {game.shortDesc}
                </p>

                {/* Tag pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {game.tags.slice(0, i === 0 ? 5 : 3).map(tag => (
                    <span key={tag} style={{
                      padding: "0.2em 0.65em", fontSize: "0.58rem", letterSpacing: "0.12em",
                      textTransform: "uppercase", border: `1px solid ${game.accent}30`,
                      color: game.accent, borderRadius: 999,
                      background: `${game.accent}0d`,
                    }}>{tag}</span>
                  ))}
                </div>

                {/* CTA */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  marginTop: "1rem", fontSize: "0.65rem", letterSpacing: "0.15em",
                  textTransform: "uppercase", color: game.accent, fontFamily: "'Syne', sans-serif", fontWeight: 700,
                }}>
                  View Game <ChevronRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        a:hover .game-arrow { opacity: 1 !important; }
      `}</style>
    </section>
  );
}

// ── TECH STACK ────────────────────────────────────────────────────────────────

function Stack() {
  const cats: TechStackItem["cat"][] = ["Design", "Dev", "Game Dev", "Security"];
  return (
    <section id="stack" style={{ padding: "8rem 4rem", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel>Tech Stack</SectionLabel>
        <SectionTitle><span style={{ color: ACCENT }}>Tools</span> &<br />Technologies.</SectionTitle>

        {cats.map(cat => {
          const tools = techStack.filter(t => t.cat === cat);
          const catColors: Record<TechStackItem["cat"], string> = { Design: ACCENT3, Dev: ACCENT2, "Game Dev": ACCENT, Security: "#ef4444" };
          const col = catColors[cat];
          return (
            <div key={cat} style={{ marginBottom: "3rem" }}>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: col, marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 20, height: 1, background: col }} /> {cat}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.8rem" }}>
                {tools.map(({ name, icon, CustomIcon }) => (
                  <div key={name} style={{
                    padding: "1rem", background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${col}18`, borderRadius: 12,
                    display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${col}0d`; e.currentTarget.style.borderColor = `${col}44`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = `${col}18`; }}
                  >
                    {icon ? <img src={icon} alt={name} style={{ width: 22, height: 22, borderRadius: 4, objectFit: "contain" }} />
                          : CustomIcon ? <CustomIcon size={22} color={col} /> : null}
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", fontWeight: 400, lineHeight: 1.3 }}>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── CONTACT ───────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" style={{ padding: "8rem 4rem", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative" }}>
      <GlowOrb x="50%" y="50%" color={ACCENT} size={500} />
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start" }}>
        <div>
          <SectionLabel>Contact</SectionLabel>
          <SectionTitle>Let's Work<br /><span style={{ color: ACCENT }}>Together.</span></SectionTitle>
          <p style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.9, fontSize: "0.92rem", marginBottom: "2rem" }}>
            Have a project, opportunity, or idea? I'm available for internships, freelance work, and creative collaborations.
          </p>
          {[
            { icon: Mail,   val: "clarissagutlay.png@gmail.com" },
            { icon: MapPin, val: "Philippines" },
          ].map(({ icon: Icon, val }) => (
            <div key={val} style={{ display: "flex", gap: 12, marginBottom: "1rem", alignItems: "center" }}>
              <Icon size={16} color={ACCENT} />
              <span style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.6)" }}>{val}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: "2rem" }}>
            {[{ icon: ExternalLink, href: "#", label: "GitHub" }, { icon: Monitor, href: "#", label: "Behance" }].map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "0.5em 1em",
                border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999,
                color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", letterSpacing: "0.1em",
                textDecoration: "none", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
              ><Icon size={13} /> {label}</a>
            ))}
          </div>
        </div>

        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={e => e.preventDefault()}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {["First Name", "Last Name"].map(label => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{label}</label>
                <input placeholder={label === "First Name" ? "John" : "Doe"} style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff", padding: "0.8em 1em", fontSize: "0.9rem", borderRadius: 8, outline: "none",
                }} onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
            ))}
          </div>
          {[{ label: "Email", type: "email", ph: "john@example.com" }, { label: "Subject", type: "text", ph: "Project Inquiry" }].map(({ label, type, ph }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{label}</label>
              <input type={type} placeholder={ph} style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff", padding: "0.8em 1em", fontSize: "0.9rem", borderRadius: 8, outline: "none",
              }} onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>Message</label>
            <textarea rows={5} placeholder="Tell me about your project..." style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff", padding: "0.8em 1em", fontSize: "0.9rem", borderRadius: 8, outline: "none", resize: "none",
            }} onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
          </div>
          <button type="submit" style={{
            alignSelf: "flex-start", padding: "0.85em 2.2em",
            background: `linear-gradient(135deg, ${ACCENT}, #ff1493)`,
            color: "#000", fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase",
            fontFamily: "'Syne', sans-serif", fontWeight: 700, cursor: "pointer", borderRadius: 6,
            transition: "all 0.3s ease",
            boxShadow: `0 0 20px ${ACCENT}40, 0 0 40px ${ACCENT}20`,
            border: `1px solid ${ACCENT}80`,
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 30px ${ACCENT}60, 0 0 60px ${ACCENT}40`; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 20px ${ACCENT}40, 0 0 40px ${ACCENT}20`; e.currentTarget.style.transform = "translateY(0)"; }}
          >Send Message →</button>
        </form>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{
      padding: "2rem 4rem", borderTop: "1px solid rgba(255,255,255,0.06)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", flexWrap: "wrap", gap: "1rem",
    }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "#fff" }}>
        <a href="#hero" className="nav-logo">
            <img src="/assets/logo.png" alt="CA logo" style={{ height: 26, width: "auto", display: "block" }} />
          </a>
      </div>
      <div>© 2025 Clarissa Angel. All rights reserved.</div>
      <a href="assets/clarissa-angel-cv.pdf" download style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "0.45em 1.1em",
        background: `linear-gradient(135deg, ${ACCENT}, #ff1493)`,
        color: "#000", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase",
        textDecoration: "none", borderRadius: 999, transition: "all 0.3s ease",
        boxShadow: `0 0 15px ${ACCENT}40, 0 0 30px ${ACCENT}20`,
        border: `1px solid ${ACCENT}80`,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 25px ${ACCENT}60, 0 0 50px ${ACCENT}40`; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 15px ${ACCENT}40, 0 0 30px ${ACCENT}20`; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        <Download size={12} /> Download CV
      </a>
    </footer>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #05050f; color: #fff; font-family: 'Proxima Nova', sans-serif; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #05050f; }
        ::-webkit-scrollbar-thumb { background: ${ACCENT}; border-radius: 2px; }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.4);} 50%{box-shadow:0 0 0 6px rgba(34,197,94,0);} }
        .overlay:hover { opacity: 1 !important; }
      `}</style>
      <SplashCursor
        DENSITY_DISSIPATION={6}
        VELOCITY_DISSIPATION={2.5}
        PRESSURE={0.15}
        CURL={11}
        SPLAT_RADIUS={0.16}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={10}
        SHADING
        RAINBOW_MODE={false}
        COLOR="#EC4899"
      />
      <Noise />
      <Nav />
      <Hero />
      <About />
      <Projects />
      <Games />
      <HallOfAchievements />
      <Stack />
      <Contact />
      <Footer />
    </>
  );
}
