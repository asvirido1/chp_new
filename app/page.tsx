'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Camera, CheckCircle, Smartphone, TerminalSquare } from 'lucide-react';

const mockStats = {
  totalReports: 14253,
  resolvedReports: 9841,
  citiesCovered: 12,
  topCategories: [
    { category: 'micromobility', count: 5430 },
    { category: 'delivery', count: 4120 },
    { category: 'car', count: 2100 },
  ],
};

const categoryMap: Record<string, string> = {
  delivery: 'Доставка',
  micromobility: 'Самокаты',
  carsharing: 'Каршеринг',
  taxi: 'Такси',
  car: 'Автомобили',
  other: 'Другое',
};

const CHARCOAL = '#141414';
const YELLOW = '#FEC733';
const PINK = '#FFE6F7';
const SURFACE = '#FFFDF9';
const BORDER = '#585858';

export default function Home() {
  const stats = mockStats;
  const cubicBezier: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: cubicBezier } },
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.11 } },
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden font-sans" style={{ fontFamily: '"Inter", sans-serif' }}>
      {/* ── HEADER ── */}
      <header
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-10 py-4"
        style={{ background: CHARCOAL, borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="text-white font-bold text-lg">CHPOK</div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <a href="#how-it-works" className="hover:text-white transition-colors">
            Как работает
          </a>
          <a href="#incidents" className="hover:text-white transition-colors">
            Нарушения
          </a>
          <a href="#mission" className="hover:text-white transition-colors">
            Миссия
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button
            className="hidden md:flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider transition-colors"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            <TerminalSquare className="w-3.5 h-3.5" /> Admin
          </button>
          <a
            href="#download"
            className="font-bold text-sm px-5 py-2 uppercase tracking-wide transition-colors"
            style={{ background: YELLOW, color: CHARCOAL }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#FFD84D')}
            onMouseLeave={(e) => (e.currentTarget.style.background = YELLOW)}
          >
            Чпокнуть!
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden pt-36 pb-28 px-6 md:px-12 lg:px-24"
        style={{ background: PINK, color: CHARCOAL }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(20,20,20,0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(20,20,20,0.04) 1px, transparent 1px)`,
            backgroundSize: '72px 72px',
          }}
        />
        <div
          className="absolute top-1/4 right-0 w-96 h-96 pointer-events-none"
          style={{ background: `${YELLOW}28`, borderRadius: '50%', filter: 'blur(140px)' }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest px-3 py-1.5 mb-8"
                style={{ background: 'rgba(20,20,20,0.06)', color: '#5D5856', border: `1px solid ${BORDER}` }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: YELLOW }} />
                Народный сервис контроля
              </motion.div>

              <motion.h1 variants={fadeUp} className="font-bold uppercase tracking-tighter leading-tight mb-8" style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', color: CHARCOAL }}>
                Один чпок —<br />
                <span style={{ color: YELLOW }}>нарушение</span>
                <br />
                замечено.
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg leading-relaxed mb-10 max-w-md" style={{ color: '#5D5856' }}>
                Самокаты на тротуаре, курьеры на встречке, каршеринг на зебре — фиксируй инциденты и отправляй их по назначению. Просто, анонимно, по делу.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#download"
                  className="font-bold text-sm px-8 py-4 uppercase tracking-wide transition-colors flex items-center justify-center gap-2.5"
                  style={{ background: YELLOW, color: CHARCOAL }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#FFD84D')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = YELLOW)}
                >
                  <Smartphone className="w-5 h-5" />
                  Скачать CHPOK
                </a>
                <a
                  href="#how-it-works"
                  className="font-medium text-sm px-8 py-4 transition-colors flex items-center justify-center gap-2"
                  style={{ background: 'rgba(20,20,20,0.06)', color: CHARCOAL, border: `1px solid ${BORDER}` }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(20,20,20,0.10)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(20,20,20,0.06)')}
                >
                  Как это работает <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            </div>

            {/* Stats card */}
            <motion.div
              variants={fadeUp}
              className="p-8"
              style={{
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                boxShadow: '0 8px 32px rgba(20,20,20,0.08)',
              }}
            >
              <div className="flex justify-between items-end pb-6 mb-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: '#A79E9A' }}>
                    Всего чпоков
                  </div>
                  <div className="font-bold text-5xl" style={{ color: CHARCOAL }}>
                    {stats.totalReports.toLocaleString('ru-RU')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: '#A79E9A' }}>
                    Обработано
                  </div>
                  <div className="font-bold text-3xl" style={{ color: CHARCOAL }}>
                    {stats.resolvedReports.toLocaleString('ru-RU')}
                  </div>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <div className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: '#A79E9A' }}>
                  Топ категории
                </div>
                {stats.topCategories.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5" style={{ borderBottom: i < stats.topCategories.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                    <span className="text-sm font-medium" style={{ color: '#5D5856' }}>
                      {categoryMap[cat.category] || cat.category}
                    </span>
                    <span className="font-mono text-sm font-bold" style={{ color: CHARCOAL }}>
                      {cat.count.toLocaleString('ru-RU')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center font-mono text-xs uppercase tracking-widest" style={{ color: '#A79E9A' }}>
                <span>{stats.citiesCovered} городов</span>
                <span className="flex items-center gap-1.5" style={{ color: YELLOW }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: YELLOW }} />
                  Live
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-28 px-6 md:px-12 lg:px-24" style={{ background: CHARCOAL, color: 'white' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} className="mb-16">
            <div className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: YELLOW }}>
              // Всё просто
            </div>
            <h2 className="font-bold uppercase tracking-tighter text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Берёшь и <span style={{ color: YELLOW }}>чпокаешь</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Camera,
                num: '01',
                title: 'Сфотографируй',
                desc: 'Открой приложение и сними нарушение — самокат поперёк тротуара, курьера на встречке или каршеринг на зебре.',
              },
              {
                icon: MapPin,
                num: '02',
                title: 'Укажи детали',
                desc: 'Выбери категорию и бренд. Геолокация подтянется сама — укажи только, что произошло.',
              },
              {
                icon: CheckCircle,
                num: '03',
                title: 'Отправь чпок',
                desc: 'Мы разберёмся, куда и кому передать. Компании получают сигналы и реагируют.',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6, ease: cubicBezier } },
                }}
                className="p-8 transition-transform duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderTop: `2px solid ${YELLOW}`,
                }}
              >
                <div className="flex justify-between items-start mb-8">
                  <step.icon className="w-7 h-7" style={{ color: YELLOW }} strokeWidth={1.5} />
                  <span className="font-mono text-2xl font-bold" style={{ color: 'rgba(255,255,255,0.15)' }}>
                    {step.num}
                  </span>
                </div>
                <h3 className="font-bold uppercase tracking-tight text-white text-xl mb-3">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.48)' }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE TRACK ── */}
      <section id="incidents" className="py-28 px-6 md:px-12 lg:px-24" style={{ background: PINK }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: '#A79E9A' }}>
                // Типы нарушений
              </div>
              <h2 className="font-bold uppercase tracking-tighter" style={{ color: CHARCOAL, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                Что фиксирует
                <br />
                чпокер
              </h2>
            </div>
            <p className="text-sm leading-relaxed max-w-xs pl-4" style={{ color: '#5D5856', borderLeft: `2px solid ${YELLOW}` }}>
              Мобильный транспорт вышел из-под контроля? Фиксируем и передаём данные напрямую операторам и городским службам.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5 } },
                }}
                className="group p-7 transition-all duration-300"
                style={{ background: SURFACE, border: `1px solid ${BORDER}`, boxShadow: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(20,20,20,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div className="flex justify-between items-start mb-10">
                  <span className="font-mono text-xs font-bold" style={{ color: '#A79E9A' }}>
                    {cat.id}
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" style={{ color: YELLOW }} />
                </div>
                <h3 className="font-bold uppercase tracking-tight text-2xl mb-2" style={{ color: CHARCOAL }}>
                  {cat.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#5D5856' }}>
                  {cat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section id="mission" className="py-28 px-6 md:px-12 lg:px-24" style={{ background: YELLOW }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="font-mono text-xs uppercase tracking-widest mb-6" style={{ color: '#5D5856' }}>
                // Миссия
              </div>
              <h2 className="font-bold uppercase tracking-tighter leading-none mb-8" style={{ color: CHARCOAL, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                Каждый чпок —
                <br />
                акт гражданской
                <br />
                заботы.
              </h2>
              <div className="space-y-5 text-base leading-relaxed max-w-md" style={{ color: '#5D5856' }}>
                <p>Нарушения фиксируются и не остаются незамеченными. Компании получают сигналы и вынуждены реагировать.</p>
                <p>Становясь чпокером, вы делаете город безопаснее — для себя, для пешеходов, для всех. Без скандалов и без полиции.</p>
                <p>
                  <strong className="font-semibold" style={{ color: CHARCOAL }}>
                    Чпок — это не просто клик. Это вклад в городскую среду.
                  </strong>
                </p>
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:pt-10">
              <div className="p-10" style={{ background: CHARCOAL }}>
                <div className="font-mono text-xs uppercase tracking-widest mb-8 pb-4" style={{ color: YELLOW, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  // Цели на 2026
                </div>
                <ul className="space-y-8">
                  {['100 000 активных чпокеров', 'Открытое API для СМИ', 'Штрафы на основе данных чпоков'].map((goal, i) => (
                    <li key={i} className="flex items-start gap-5">
                      <span className="font-mono text-sm font-bold shrink-0 mt-0.5" style={{ color: YELLOW }}>
                        0{i + 1}.
                      </span>
                      <span className="text-xl font-bold uppercase tracking-tight text-white">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="download" className="py-28 px-6 md:px-12 lg:px-24" style={{ background: SURFACE }}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-bold uppercase tracking-tighter mb-6" style={{ color: CHARCOAL, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
              Готов чпокать?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg leading-relaxed mb-10" style={{ color: '#5D5856' }}>
              Скачай CHPOK и стань частью сообщества граждан, которые делают наши города безопаснее. Один чпок — и нарушение замечено.
            </motion.p>
            <motion.a
              variants={fadeUp}
              href="#"
              className="inline-flex items-center gap-2.5 font-bold text-sm px-10 py-5 uppercase tracking-wide transition-all duration-300 transform hover:scale-105"
              style={{ background: YELLOW, color: CHARCOAL }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#FFD84D')}
              onMouseLeave={(e) => (e.currentTarget.style.background = YELLOW)}
            >
              <Smartphone className="w-5 h-5" />
              Скачать для iOS и Android
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 md:px-12 lg:px-24" style={{ background: CHARCOAL, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div style={{ color: 'rgba(255,255,255,0.35)' }} className="text-sm font-mono">
            © 2026 CHPOK. Всё, что ты видишь — в твоих руках.
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.55)' }} onMouseEnter={(e) => (e.currentTarget.style.color = YELLOW)} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
              Условия
            </a>
            <a href="#" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.55)' }} onMouseEnter={(e) => (e.currentTarget.style.color = YELLOW)} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
              Контакты
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

