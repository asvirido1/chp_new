import React from "react";

const C = {
  bg: "#F5E8DC",
  card: "#FFFAF5",
  dark: "#261506",
  accent: "#E04E1F",
  accentHover: "#C43A0D",
  text: "#261506",
  textSec: "#7A5C48",
  textMut: "#B8997E",
  border: "#D4B89A",
  borderSoft: "rgba(212,184,154,0.40)",
  white: "#FFFAF5",
};

const R = {
  sm: 10,
  md: 18,
  lg: 24,
  xl: 32,
  full: 9999,
};

const stats = [
  { label: "Доставка", count: "5 430" },
  { label: "Самокаты", count: "4 120" },
  { label: "Каршеринг", count: "2 100" },
];

export function VariantA() {
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
      {/* Grid overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `linear-gradient(to right, rgba(38,21,6,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(38,21,6,0.04) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
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
          background: C.dark,
          borderBottom: `1px solid rgba(255,250,245,0.06)`,
        }}
      >
        <div
          style={{
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: "-0.05em",
            color: C.white,
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
                color: "rgba(255,250,245,0.50)",
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
            color: C.white,
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
        {/* Warm glow */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "-8%",
            width: 640,
            height: 640,
            background: `${C.accent}22`,
            borderRadius: "50%",
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />

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
                background: "rgba(38,21,6,0.07)",
                border: `1px solid ${C.border}`,
                color: C.textSec,
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
              <span style={{ color: C.accent }}>нарушение</span>
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
                  color: C.white,
                  fontWeight: 800,
                  fontSize: 13,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderRadius: R.full,
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
                  border: `1.5px solid ${C.border}`,
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
              border: `1.5px solid ${C.border}`,
              borderRadius: R.xl,
              padding: 32,
              boxShadow: "0 12px 48px rgba(38,21,6,0.10)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                paddingBottom: 20,
                marginBottom: 20,
                borderBottom: `1px solid ${C.borderSoft}`,
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
                  style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em", color: C.text }}
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
                  borderBottom: i < stats.length - 1 ? `1px solid ${C.borderSoft}` : "none",
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
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,250,245,0.35)",
          }}
        >
          Вариант A
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
              style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10, color: "rgba(255,250,245,0.45)", fontWeight: 600, letterSpacing: "0.06em" }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: hex as string,
                  border: "1px solid rgba(255,250,245,0.15)",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {name}: {hex}
            </div>
          ))}
          <div style={{ color: "rgba(255,250,245,0.45)", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em" }}>
            Радиус: full/xl/lg
          </div>
        </div>
      </div>
    </div>
  );
}

export default VariantA;
