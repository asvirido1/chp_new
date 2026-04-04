import React from "react";

const C = {
  bg: "#0E1117",
  card: "#181E2A",
  dark: "#0A0D12",
  accent: "#C8FF47",
  accentDim: "rgba(200,255,71,0.12)",
  text: "#ECF2E8",
  textSec: "rgba(236,242,232,0.55)",
  textMut: "rgba(236,242,232,0.28)",
  border: "rgba(200,255,71,0.18)",
  borderNeutral: "rgba(236,242,232,0.08)",
  white: "#ECF2E8",
};

const R = {
  sm: 12,
  md: 20,
  lg: 28,
  xl: 36,
  full: 9999,
};

const stats = [
  { label: "Доставка", count: "5 430" },
  { label: "Самокаты", count: "4 120" },
  { label: "Каршеринг", count: "2 100" },
];

export function VariantB() {
  return (
    <div
      style={{
        fontFamily: "'Space Grotesk', 'DM Sans', system-ui, sans-serif",
        background: C.bg,
        minHeight: "100vh",
        color: C.text,
        overflowX: "hidden",
      }}
    >
      {/* Grid overlay — subtle */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `linear-gradient(to right, rgba(200,255,71,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(200,255,71,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Neon ambient glow top-right */}
      <div
        style={{
          position: "fixed",
          top: "-10%",
          right: "-5%",
          width: 700,
          height: 700,
          background: `radial-gradient(circle, ${C.accentDim} 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 40px",
          background: `${C.dark}E8`,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.borderNeutral}`,
        }}
      >
        <div
          style={{
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: "-0.05em",
            color: C.accent,
            textTransform: "uppercase",
          }}
        >
          ЧПОК!
        </div>

        <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Как работает", "Нарушения", "Миссия"].map((item) => (
            <a
              key={item}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: C.textSec,
                textDecoration: "none",
                letterSpacing: "0.01em",
              }}
            >
              {item}
            </a>
          ))}
        </nav>

        <a
          style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "9px 22px",
            background: C.accent,
            color: C.dark,
            borderRadius: R.full,
            textDecoration: "none",
          }}
        >
          Чпокнуть!
        </a>
      </header>

      {/* Hero */}
      <section
        style={{
          position: "relative",
          paddingTop: 140,
          paddingBottom: 80,
          paddingLeft: 64,
          paddingRight: 64,
          zIndex: 1,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 420px",
            gap: 64,
            alignItems: "center",
          }}
        >
          {/* Left */}
          <div>
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "7px 16px",
                borderRadius: R.full,
                background: C.accentDim,
                border: `1px solid ${C.border}`,
                color: C.accent,
                marginBottom: 32,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: C.accent,
                  display: "inline-block",
                  boxShadow: `0 0 8px ${C.accent}`,
                }}
              />
              Народный сервис контроля
            </div>

            {/* Headline */}
            <h1
              style={{
                fontWeight: 900,
                fontSize: "clamp(2.6rem,6vw,5rem)",
                lineHeight: 0.93,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                marginBottom: 28,
                color: C.text,
              }}
            >
              Один чпок —<br />
              <span
                style={{
                  color: C.accent,
                  textShadow: `0 0 40px ${C.accent}66`,
                }}
              >
                нарушение
              </span>
              <br />
              замечено.
            </h1>

            {/* Sub */}
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.65,
                color: C.textSec,
                maxWidth: 420,
                marginBottom: 40,
              }}
            >
              Самокаты на тротуаре, курьеры на встречке, каршеринг на зебре —
              фиксируй инциденты и отправляй их по назначению. Просто, анонимно, по делу.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 14 }}>
              <a
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 32px",
                  background: C.accent,
                  color: C.dark,
                  fontWeight: 800,
                  fontSize: 13,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderRadius: R.full,
                  boxShadow: `0 0 32px ${C.accent}44`,
                }}
              >
                📱 Скачать CHPOK
              </a>
              <a
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 28px",
                  background: "transparent",
                  border: `1.5px solid ${C.borderNeutral}`,
                  color: C.text,
                  fontWeight: 600,
                  fontSize: 13,
                  textDecoration: "none",
                  borderRadius: R.full,
                }}
              >
                Как это работает →
              </a>
            </div>
          </div>

          {/* Stats card */}
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.borderNeutral}`,
              borderRadius: R.xl,
              padding: 32,
              boxShadow: `0 0 60px rgba(0,0,0,0.6), inset 0 1px 0 ${C.borderNeutral}`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* card glow */}
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 200,
                height: 200,
                background: `radial-gradient(circle, ${C.accentDim} 0%, transparent 70%)`,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                paddingBottom: 20,
                marginBottom: 20,
                borderBottom: `1px solid ${C.borderNeutral}`,
                position: "relative",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: C.textMut,
                    marginBottom: 6,
                  }}
                >
                  Всего чпоков
                </div>
                <div
                  style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-0.04em", color: C.text }}
                >
                  14 253
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: C.textMut,
                    marginBottom: 6,
                  }}
                >
                  Обработано
                </div>
                <div
                  style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em", color: C.accent }}
                >
                  9 841
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: C.textMut,
                marginBottom: 12,
                position: "relative",
              }}
            >
              Топ категории
            </div>

            {stats.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < stats.length - 1 ? `1px solid ${C.borderNeutral}` : "none",
                  position: "relative",
                }}
              >
                <span style={{ fontSize: 14, color: C.textSec }}>{s.label}</span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: C.text,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {s.count}
                </span>
              </div>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 18,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: C.textMut,
                position: "relative",
              }}
            >
              <span>12 городов</span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: C.accent,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C.accent,
                    display: "inline-block",
                    boxShadow: `0 0 8px ${C.accent}`,
                  }}
                />
                Live
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Label strip */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: C.dark,
          padding: "10px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 40,
          borderTop: `1px solid ${C.borderNeutral}`,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.accent,
          }}
        >
          Вариант B
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            ["Bg", C.bg],
            ["Акцент", C.accent],
            ["Тёмный", C.dark],
            ["Карточка", C.card],
          ].map(([name, hex]) => (
            <div
              key={name}
              style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10, color: C.textMut, fontWeight: 600, letterSpacing: "0.06em" }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: hex as string,
                  border: `1px solid ${C.borderNeutral}`,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {name}: {hex}
            </div>
          ))}
          <div style={{ color: C.textMut, fontSize: 10, fontWeight: 600, letterSpacing: "0.06em" }}>
            Радиус: full/xl/lg
          </div>
        </div>
      </div>
    </div>
  );
}

export default VariantB;
