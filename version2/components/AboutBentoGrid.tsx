// ── Drop this into your About section in portfolio.tsx ───────────────────────
// Replace the existing bento grid <div style={{ display: "grid"... }}> block
// with this. Make sure to import BorderGlow at the top of portfolio.tsx:
//
//   import BorderGlow from "../components/BorderGlow";
//
// Each card gets its own glow color palette derived from the card's accent color.

import { Palette, Gamepad2, Shield, Code2 } from "lucide-react";
import BorderGlow from "../components/BorderGlow";

const ACCENT  = "#FF69B4";
const ACCENT2 = "#e61212";
const ACCENT3 = "#852ed9";

// ── Helper: turn a hex accent into BorderGlow color array ────────────────────
// We use the accent as the primary, plus two complementary tones for the mesh.
const glowPalette = (accent: string): string[] => {
  // Primary accent, a softened mid-tone, and a cooler highlight
  return [accent, `${accent}99`, "#38bdf8"];
};

// ── The bento grid (paste inside your About section JSX) ────────────────────
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>
  {[
    {
      icon: Palette,
      title: "Visual Design",
      desc: "Brand identity, print, social media, mascot design",
      color: ACCENT3,
      // HSL approximation of #852ed9 for the glow color string
      glowColor: "271 66 51",
    },
    {
      icon: Gamepad2,
      title: "Game Dev",
      desc: "Sprite sheets, character animation, game assets",
      color: "#e67c2c",
      glowColor: "25 76 54",
    },
    {
      icon: Shield,
      title: "Cyber Security",
      desc: "Hackathons, Hack4Gov, networking protocols",
      color: ACCENT2,
      glowColor: "0 88 46",
    },
    {
      icon: Code2,
      title: "Software Dev",
      desc: "Laravel, PHP, full-stack heritage apps",
      color: ACCENT,
      glowColor: "330 100 70",
    },
  ].map(({ icon: Icon, title, desc, color, glowColor }) => (
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
      colors={glowPalette(color)}
      fillOpacity={0.35}
    >
      {/* Inner card content — mirrors your existing layout exactly */}
      <div style={{ padding: "1.5rem" }}>
        <Icon size={20} color={color} style={{ marginBottom: 10 }} />
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: "0.85rem",
          color: "#fff",
          marginBottom: 6,
        }}>
          {title}
        </div>
        <div style={{
          fontSize: "0.78rem",
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.6,
        }}>
          {desc}
        </div>
      </div>
    </BorderGlow>
  ))}
</div>