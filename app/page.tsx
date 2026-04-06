'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, CheckCircle, Smartphone, TerminalSquare } from 'lucide-react';

console.log('[v0] Landing page rendering');

export default function Home() {
  const CHARCOAL = '#141414';
  const YELLOW = '#FEC733';
  const PINK = '#FFE6F7';
  const SURFACE = '#FFFDF9';
  const BORDER = '#585858';

  return (
    <div style={{ minHeight: '100vh', width: '100%', overflowX: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* HEADER */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 50,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          background: CHARCOAL,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.125rem' }}>CHPOK</div>

        <nav style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255,255,255,0.55)' }}>
          <a href="#how-it-works" style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>
            Как работает
          </a>
          <a href="#incidents" style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>
            Нарушения
          </a>
          <a href="#mission" style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>
            Миссия
          </a>
        </nav>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            style={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              color: 'rgba(255,255,255,0.35)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Admin
          </button>
          <a
            href="#download"
            style={{
              fontWeight: 'bold',
              fontSize: '0.875rem',
              padding: '0.5rem 1.25rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: YELLOW,
              color: CHARCOAL,
              textDecoration: 'none',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            Чпокнуть!
          </a>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '9rem',
          paddingBottom: '7rem',
          padding: '9rem 2rem 7rem',
          background: PINK,
          color: CHARCOAL,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: `linear-gradient(to right, rgba(20,20,20,0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(20,20,20,0.04) 1px, transparent 1px)`,
            backgroundSize: '72px 72px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '25%',
            right: 0,
            width: '24rem',
            height: '24rem',
            pointerEvents: 'none',
            background: `${YELLOW}28`,
            borderRadius: '50%',
            filter: 'blur(140px)',
          }}
        />

        <div style={{ maxWidth: '80rem', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  padding: '0.375rem 0.75rem',
                  marginBottom: '2rem',
                  background: 'rgba(20,20,20,0.06)',
                  color: '#5D5856',
                  border: `1px solid ${BORDER}`,
                }}
              >
                <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', background: YELLOW, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                Народный сервис контроля
              </div>

              <h1 style={{ fontSize: '4rem', fontWeight: 'bold', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '2rem', color: CHARCOAL }}>
                Один чпок —<br />
                <span style={{ color: YELLOW }}>нарушение</span>
                <br />
                замечено.
              </h1>

              <p style={{ fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '28rem', color: '#5D5856' }}>
                Самокаты на тротуаре, курьеры на встречке, каршеринг на зебре — фиксируй инциденты и отправляй их по назначению. Просто, анонимно, по делу.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a
                  href="#download"
                  style={{
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    padding: '1rem 2rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: YELLOW,
                    color: CHARCOAL,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.625rem',
                    width: 'fit-content',
                  }}
                >
                  <Smartphone size={20} />
                  Скачать CHPOK
                </a>
                <a
                  href="#how-it-works"
                  style={{
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    padding: '1rem 2rem',
                    background: 'rgba(20,20,20,0.06)',
                    color: CHARCOAL,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: 'fit-content',
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  Как это работает <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              style={{
                padding: '2rem',
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                boxShadow: '0 8px 32px rgba(20,20,20,0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: `1px solid ${BORDER}` }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', color: '#A79E9A' }}>
                    Всего чпоков
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '3rem', color: CHARCOAL }}>14,253</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', color: '#A79E9A' }}>
                    Обработано
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.875rem', color: CHARCOAL }}>9,841</div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', color: '#A79E9A' }}>
                  Топ категории
                </div>
                {[
                  { name: 'Самокаты', count: '5,430' },
                  { name: 'Доставка', count: '4,120' },
                  { name: 'Автомобили', count: '2,100' },
                ].map((cat, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: i < 2 ? `1px solid ${BORDER}` : 'none' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#5D5856' }}>{cat.name}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 'bold', color: CHARCOAL }}>{cat.count}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'monospace', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A79E9A' }}>
                <span>12 городов</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: YELLOW }}>
                  <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', background: YELLOW, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                  Live
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '7rem 2rem', background: CHARCOAL, color: 'white' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} viewport={{ once: true }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', color: YELLOW }}>
              // Всё просто
            </div>
            <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '-0.02em', fontSize: '3.5rem', color: 'white', marginBottom: '4rem' }}>
              Берёшь и <span style={{ color: YELLOW }}>чпокаешь</span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {[
              { num: '01', title: 'Сфотографируй', desc: 'Открой приложение и сними нарушение — самокат поперёк тротуара, курьера на встречке или каршеринг на зебре.' },
              { num: '02', title: 'Укажи детали', desc: 'Выбери категорию и бренд. Геолокация подтянется сама — укажи только, что произошло.' },
              { num: '03', title: 'Отправь чпок', desc: 'Мы разберёмся, куда и кому передать. Компании получают сигналы и реагируют.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                viewport={{ once: true }}
                style={{
                  padding: '2rem',
                  background: 'rgba(255,255,255,0.04)',
                  borderTop: `2px solid ${YELLOW}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <Camera size={28} style={{ color: YELLOW }} />
                  <span style={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.15)' }}>{step.num}</span>
                </div>
                <h3 style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em', color: 'white', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.48)' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE TRACK */}
      <section id="incidents" style={{ padding: '7rem 2rem', background: PINK }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} viewport={{ once: true }} style={{ marginBottom: '4rem' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', color: '#A79E9A' }}>
              // Типы нарушений
            </div>
            <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '-0.02em', fontSize: '3.5rem', color: CHARCOAL }}>
              Что фиксирует<br />чпокер
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { id: '01', title: 'Самокаты', desc: 'Брошены поперёк тротуара, на газонах, или едят сразу двое.' },
              { id: '02', title: 'Доставка', desc: 'Курьеры на электровелосипедах создают опасность для пешеходов.' },
              { id: '03', title: 'Каршеринг', desc: 'Парковка на тротуарах, велополосах и пешеходных зонах.' },
              { id: '04', title: 'Такси', desc: 'Остановка вторым рядом, блокировка пешеходных переходов.' },
              { id: '05', title: 'Автомобили', desc: 'Езда по обочинам, парковка на местах для инвалидов.' },
              { id: '06', title: 'Прочее', desc: 'Любой другой инфраструктурный беспредел в городе.' },
            ].map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                viewport={{ once: true }}
                style={{
                  padding: '1.75rem',
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  boxShadow: 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(20,20,20,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 'bold', color: '#A79E9A' }}>{cat.id}</span>
                  <ArrowRight size={16} style={{ color: YELLOW, opacity: 0 }} />
                </div>
                <h3 style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em', fontSize: '1.5rem', marginBottom: '0.5rem', color: CHARCOAL }}>
                  {cat.title}
                </h3>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#5D5856' }}>{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section id="mission" style={{ padding: '7rem 2rem', background: YELLOW }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'flex-start' }}>
            <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} viewport={{ once: true }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', color: '#5D5856' }}>
                // Миссия
              </div>
              <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '2rem', color: CHARCOAL, fontSize: '3.5rem' }}>
                Каждый чпок —<br />
                акт гражданской<br />
                заботы.
              </h2>
              <div style={{ fontSize: '1rem', lineHeight: 1.6, maxWidth: '28rem', color: '#5D5856' }}>
                <p style={{ marginBottom: '1.25rem' }}>Нарушения фиксируются и не остаются незамеченными. Компании получают сигналы и вынуждены реагировать.</p>
                <p style={{ marginBottom: '1.25rem' }}>Становясь чпокером, вы делаете город безопаснее — для себя, для пешеходов, для всех. Без скандалов и без полиции.</p>
                <p>
                  <strong style={{ fontWeight: '600', color: CHARCOAL }}>
                    Чпок — это не просто клик. Это вклад в городскую среду.
                  </strong>
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              viewport={{ once: true }}
              style={{ paddingTop: '2.5rem' }}
            >
              <div style={{ padding: '2.5rem', background: CHARCOAL }}>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '2rem',
                    paddingBottom: '1rem',
                    color: YELLOW,
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  // Цели на 2026
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {['100 000 активных чпокеров', 'Открытое API для СМИ', 'Штрафы на основе данных чпоков'].map((goal, i) => (
                    <li key={i} style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 'bold', color: YELLOW, flexShrink: 0 }}>0{i + 1}.</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em', color: 'white' }}>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="download" style={{ padding: '7rem 2rem', background: SURFACE }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} viewport={{ once: true }}>
            <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '1.5rem', color: CHARCOAL, fontSize: '2.8rem' }}>
              Готов чпокать?
            </h2>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '2.5rem', color: '#5D5856' }}>
              Скачай CHPOK и стань частью сообщества граждан, которые делают наши города безопаснее. Один чпок — и нарушение замечено.
            </p>
            <a
              href="#"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.625rem',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                padding: '1.25rem 2.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: YELLOW,
                color: CHARCOAL,
                textDecoration: 'none',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFD84D';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = YELLOW;
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Smartphone size={20} />
              Скачать для iOS и Android
            </a>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '3rem 2rem', background: CHARCOAL, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem', fontFamily: 'monospace' }}>
            © 2026 CHPOK. Всё, что ты видишь — в твоих руках.
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#" style={{ fontSize: '0.875rem', textDecoration: 'none', color: 'rgba(255,255,255,0.55)', cursor: 'pointer' }}>
              Условия
            </a>
            <a href="#" style={{ fontSize: '0.875rem', textDecoration: 'none', color: 'rgba(255,255,255,0.55)', cursor: 'pointer' }}>
              Контакты
            </a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
