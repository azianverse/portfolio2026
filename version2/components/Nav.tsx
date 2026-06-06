"use client";

import { useState, useEffect } from "react";

const ACCENT = "#FF69B4";

const NAV_LINKS = [
  { label: "Home",     href: "#hero"     },
  { label: "About",    href: "#about"    },
  { label: "Projects", href: "#projects" },
  { label: "Games",    href: "#games"    },
  { label: "Achievements",     href: "#achievements"     },
  { label: "Contact",  href: "#contact"  },
];

export default function Nav() {
  const [activeLink, setActiveLink] = useState("#hero");
  const [menuOpen,   setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const ids = NAV_LINKS.map(l => l.href.replace("#", ""));
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveLink(`#${id}`);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 620) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&display=swap');

        .nav-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          display: flex;
          justify-content: center;
          padding: 1.1rem 1.5rem;
          pointer-events: none;
        }

        .nav-pill {
          pointer-events: all;
          display: flex;
          align-items: center;
          position: relative;
          width: 100%;
          max-width: 860px;
          padding: 0.45rem 0.45rem 0.45rem 1.5rem;
          border-radius: 999px;
          background: rgba(8, 8, 24, 0.52);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border: 1px solid rgba(255,255,255,0.13);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.07),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            0 8px 32px rgba(0,0,0,0.55),
            0 0 80px rgba(255,105,180,0.05);
          transition: border-color 0.35s, box-shadow 0.35s;
        }

        .nav-pill:hover {
          border-color: rgba(255,255,255,0.2);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.3),
            0 12px 40px rgba(0,0,0,0.65),
            0 0 100px rgba(255,105,180,0.09);
        }

        /* ── Logo — stays left ── */
        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.05rem;
          color: #fff;
          text-decoration: none;
          letter-spacing: 0.06em;
          flex-shrink: 0;
          width: 120px;
        }

        /* ── Spacer pushes links to the right ── */
        .nav-spacer { display: none; }

        /* ── Links wrapper — sits right of spacer ── */
        .nav-links {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0.15rem;
        }

        /* ── Individual link ── */
        .nav-link {
          position: relative;
          padding: 0.42em 0.9em;
          font-family: 'Syne', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          color: rgba(255,255,255,0.5);
          border-radius: 999px;
          transition: color 0.25s, background 0.25s;
          white-space: nowrap;
          z-index: 1;
        }

        .nav-link:hover {
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.07);
        }

        /* ── ACTIVE: gradient pill with glow ── */
        .nav-link.active {
          color: #fff;
          background: linear-gradient(135deg, ${ACCENT}cc, #ff149380, #c026d380);
          box-shadow:
            0 0 12px ${ACCENT}60,
            0 0 28px ${ACCENT}30,
            inset 0 1px 0 rgba(255,255,255,0.2);
          border: 1px solid ${ACCENT}55;
          font-weight: 700;
        }

        .nav-link.active:hover {
          background: linear-gradient(135deg, ${ACCENT}, #ff1493, #c026d3);
          box-shadow:
            0 0 20px ${ACCENT}80,
            0 0 40px ${ACCENT}40,
            inset 0 1px 0 rgba(255,255,255,0.25);
          color: #fff;
        }

        /* ── Available badge ── */
        .nav-available {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          flex-shrink: 0;
          margin-left: auto;
          width: 120px;
          padding: 0.5em 1.15em;
          border-radius: 999px;
          font-family: 'Syne', sans-serif;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${ACCENT};
          background: rgba(255,105,180,0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,105,180,0.38);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.08),
            0 0 18px rgba(255,105,180,0.2),
            0 0 36px rgba(255,105,180,0.08);
          transition: all 0.3s ease;
          cursor: default;
        }

        .nav-available:hover {
          background: rgba(255,105,180,0.18);
          border-color: rgba(255,105,180,0.6);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.1),
            0 0 28px rgba(255,105,180,0.35),
            0 0 56px rgba(255,105,180,0.15);
        }

        .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          flex-shrink: 0;
          animation: glow-pulse 2s ease-in-out infinite;
        }

        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 0 0   rgba(34,197,94,0.5); }
          50%       { box-shadow: 0 0 0 5px rgba(34,197,94,0);   }
        }

        /* ── Hamburger ── */
        .nav-hamburger {
          display: none;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          margin-left: auto;
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .nav-hamburger:hover { background: rgba(255,255,255,0.1); }

        .hbar {
          display: block;
          width: 16px; height: 1.5px;
          background: rgba(255,255,255,0.8);
          border-radius: 2px;
          transition: all 0.3s ease;
          transform-origin: center;
        }
        .hbar-top.open { transform: translateY(6.5px) rotate(45deg); }
        .hbar-mid.open { opacity: 0; transform: scaleX(0); }
        .hbar-bot.open { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── Mobile drawer ── */
        .mobile-drawer {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: min(300px, 82vw);
          z-index: 49;
          background: rgba(5, 5, 15, 0.97);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-left: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          padding: 5.5rem 2rem 2.5rem;
          gap: 0.3rem;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .mobile-drawer.open { transform: translateX(0); }

        .mobile-link {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.3rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          text-decoration: none;
          color: rgba(255,255,255,0.6);
          padding: 0.65rem 0.75rem;
          border-radius: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: color 0.2s, background 0.2s, padding-left 0.2s;
        }
        .mobile-link:hover {
          color: #fff;
          padding-left: 1.2rem;
        }
        .mobile-link.active {
          color: #fff;
          background: linear-gradient(135deg, ${ACCENT}40, #ff149325, #c026d320);
          border-color: transparent;
          padding-left: 1rem;
          box-shadow: inset 0 0 0 1px ${ACCENT}33;
        }

        .mobile-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 2rem;
          padding: 0.65em 1.3em;
          border-radius: 999px;
          background: rgba(255,105,180,0.1);
          border: 1px solid rgba(255,105,180,0.3);
          font-family: 'Syne', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${ACCENT};
          align-self: flex-start;
        }

        /* ── Responsive ── */
        @media (max-width: 620px) {
          .nav-links      { display: none !important; }
          .nav-available  { display: none !important; width: 0 !important; margin: 0 !important; padding: 0 !important; }
          .nav-hamburger  { display: flex !important; margin-left: auto !important; }
          .nav-pill       { padding-right: 0.45rem; justify-content: space-between; }
        }
      `}</style>

      {/* ── Floating pill ── */}
      <div className="nav-root">
        <div className="nav-pill">

          {/* Logo — far left */}
          <a href="#hero" className="nav-logo">
            <img src="/assets/logo.png" alt="CA logo" style={{ height: 26, width: "auto", display: "block" }} />
          </a>

          {/* Hamburger — mobile only */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle navigation menu"
          >
            <span className={`hbar hbar-top${menuOpen ? " open" : ""}`} />
            <span className={`hbar hbar-mid${menuOpen ? " open" : ""}`} />
            <span className={`hbar hbar-bot${menuOpen ? " open" : ""}`} />
          </button>

          {/* Spacer — pushes everything after it to the right */}
          <div className="nav-spacer" />

          {/* Links — right side */}
          <nav className="nav-links">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className={`nav-link${activeLink === href ? " active" : ""}`}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Available badge — far right */}
          <div className="nav-available">
            <span className="pulse-dot" />
            Available
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <div className={`mobile-drawer${menuOpen ? " open" : ""}`}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
          opacity: 0.5,
        }} />

        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className={`mobile-link${activeLink === href ? " active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}

        <div className="mobile-badge">
          <span className="pulse-dot" />
          Available for Internship
        </div>

        <div style={{
          marginTop: "auto",
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: "0.75rem", color: "rgba(255,255,255,0.07)",
        }}>
          CA<span style={{ color: `${ACCENT}20` }}>.</span>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 48,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}
    </>
  );
}
