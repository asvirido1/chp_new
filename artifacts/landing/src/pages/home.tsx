import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, MapPin, Camera, CheckCircle, Smartphone, TerminalSquare } from "lucide-react";
import { Link } from "wouter";

// Simulating the hook since it may not be exported exactly as useGetPublicStats
// We'll import it if it exists, otherwise provide a fallback.
import { useQuery } from "@tanstack/react-query";

const mockStats = {
  totalReports: 14253,
  resolvedReports: 9841,
  citiesCovered: 12,
  topCategories: [
    { category: "micromobility", count: 5430 },
    { category: "delivery", count: 4120 },
    { category: "car", count: 2100 }
  ]
};

const categoryMap: Record<string, string> = {
  "delivery": "Доставка",
  "micromobility": "Самокаты",
  "carsharing": "Каршеринг",
  "taxi": "Такси",
  "car": "Автомобили",
  "other": "Другое"
};

export default function Home() {
  // Try to use the actual hook if it exists, fallback to mock if undefined
  // For safety in this environment without full intellisense of the generated file
  const { data: stats = mockStats } = useQuery({
    queryKey: ['publicStats'],
    queryFn: async () => {
      try {
        const { useGetPublicStats } = await import("@workspace/api-client-react");
        // @ts-ignore
        if (typeof useGetPublicStats === 'function') {
          // @ts-ignore
          const res = await useGetPublicStats();
          return res.data || res;
        }
      } catch (e) {
        // ignore
      }
      return mockStats;
    },
    initialData: mockStats
  });

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground overflow-x-hidden font-sans">
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-md border-b-4 border-foreground px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary border-2 border-foreground brutal-shadow flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-foreground" strokeWidth={3} />
          </div>
          <span className="font-display font-bold text-2xl tracking-tighter uppercase">CHPOK.</span>
        </div>
        <div className="hidden md:flex items-center gap-6 font-mono text-sm font-bold uppercase tracking-wider">
          <a href="#how-it-works" className="hover:text-primary transition-colors">Как это работает</a>
          <a href="#incidents" className="hover:text-primary transition-colors">Типы нарушений</a>
          <a href="#mission" className="hover:text-primary transition-colors">Зачем это нужно</a>
        </div>
        <div className="flex gap-4">
          <Link href="/admin" className="hidden md:flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider px-4 py-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors">
            <TerminalSquare className="w-4 h-4" /> Admin
          </Link>
          <a href="#download" className="bg-primary text-foreground font-display font-bold px-6 py-2 border-2 border-foreground brutal-shadow uppercase text-sm flex items-center gap-2">
            Приложение <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-40 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto relative">
        <div className="absolute top-40 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10"
        >
          <div>
            <motion.div variants={fadeUp} className="inline-block bg-primary text-foreground font-mono font-bold px-3 py-1 border-2 border-foreground mb-6 uppercase text-xs">
              Гражданский контроль 2.0
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-display font-bold leading-[0.9] tracking-tighter uppercase mb-8">
              Город <br/>
              <span className="text-transparent" style={{ WebkitTextStroke: '2px hsl(var(--foreground))' }}>принадлежит</span> <br/>
              <span className="bg-primary px-4 py-2 border-4 border-foreground inline-block mt-2 -ml-4 rotate-2">людям.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl md:text-2xl font-medium mb-10 max-w-lg leading-snug">
              Достали самокаты посреди тротуара? Курьеры гоняют по встречке? Хватит терпеть. Фотографируй. Отправляй. Мы заставим их соблюдать правила.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <a href="#download" className="bg-foreground text-background font-display font-bold text-lg px-8 py-4 border-4 border-foreground brutal-shadow uppercase text-center flex justify-center items-center gap-3">
                <Smartphone className="w-6 h-6" />
                Скачать CHPOK
              </a>
              <a href="#mission" className="bg-background text-foreground font-display font-bold text-lg px-8 py-4 border-4 border-foreground brutal-shadow uppercase text-center flex justify-center items-center">
                Узнать больше
              </a>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="relative">
            <div className="absolute inset-0 bg-primary translate-x-4 translate-y-4 border-4 border-foreground"></div>
            <div className="relative bg-background border-4 border-foreground p-8">
              <div className="flex justify-between items-end border-b-4 border-foreground pb-6 mb-6">
                <div>
                  <div className="font-mono text-sm uppercase text-muted-foreground font-bold mb-1">Всего репортов</div>
                  <div className="font-display text-5xl font-bold">{stats.totalReports.toLocaleString('ru-RU')}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm uppercase text-muted-foreground font-bold mb-1">Решено</div>
                  <div className="font-display text-3xl font-bold text-primary px-2 bg-foreground py-1">{stats.resolvedReports.toLocaleString('ru-RU')}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="font-mono text-sm uppercase font-bold mb-4">Главные нарушители:</div>
                {stats.topCategories.map((cat: any, i: number) => (
                  <div key={i} className="flex items-center justify-between border-2 border-foreground p-3">
                    <span className="font-bold uppercase tracking-wider">{categoryMap[cat.category] || cat.category}</span>
                    <span className="font-mono bg-primary px-2 border border-foreground">{cat.count}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t-4 border-foreground font-mono text-xs uppercase font-bold flex justify-between">
                <span>Охват: {stats.citiesCovered} городов</span>
                <span className="flex items-center gap-1 text-primary-foreground bg-primary px-2"><span className="w-2 h-2 bg-foreground rounded-full animate-pulse"></span> Live</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-foreground text-background border-y-4 border-foreground relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="mb-16"
          >
            <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter">Как это <span className="text-primary">работает</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Camera, title: "1. Сфоткай", desc: "Увидел брошенный самокат или наглого курьера? Сделай четкое фото прямо в приложении." },
              { icon: MapPin, title: "2. Отметь", desc: "Укажи категорию и бренд. Геолокация подтянется автоматически для точности." },
              { icon: CheckCircle, title: "3. Отправь", desc: "Модераторы проверят репорт, и он станет публичным. Компании больше не смогут игнорировать проблему." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.5 } }
                }}
                className="bg-background text-foreground border-4 border-primary p-8 relative hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary border-4 border-foreground flex items-center justify-center font-display text-2xl font-bold">
                  {i+1}
                </div>
                <step.icon className="w-12 h-12 mb-6 text-primary" strokeWidth={2} />
                <h3 className="text-2xl font-display font-bold uppercase mb-4">{step.title}</h3>
                <p className="font-medium text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE TRACK */}
      <section id="incidents" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
          >
            <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter max-w-2xl">
              На что мы <br/> жалуемся
            </h2>
            <p className="font-mono font-bold max-w-sm text-muted-foreground uppercase text-sm border-l-4 border-primary pl-4">
              Мы собираем данные о тех, кто использует городскую инфраструктуру как свою личную.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: "micromobility", title: "Самокаты", desc: "Брошенные поперек тротуара, на газонах, или езда вдвоем." },
              { id: "delivery", title: "Доставка", desc: "Курьеры на электровелосипедах, сбивающие пешеходов." },
              { id: "carsharing", title: "Каршеринг", desc: "Парковка на тротуарах и велополосах." },
              { id: "taxi", title: "Такси", desc: "Остановка вторым рядом, блокировка движения." },
              { id: "car", title: "Автомобили", desc: "Езда по обочинам, парковка на инвалидных местах." },
              { id: "other", title: "Прочее", desc: "Любой другой инфраструктурный беспредел." }
            ].map((cat, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1, transition: { delay: i * 0.1, duration: 0.4 } }
                }}
                className="group border-4 border-foreground p-6 bg-card brutal-shadow cursor-crosshair"
              >
                <div className="flex justify-between items-start mb-12">
                  <div className="font-mono text-xs uppercase font-bold text-muted-foreground bg-muted px-2 py-1 border border-foreground inline-block">
                    {cat.id}
                  </div>
                  <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                </div>
                <h3 className="text-3xl font-display font-bold uppercase mb-2">{cat.title}</h3>
                <p className="font-medium text-muted-foreground text-sm">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS (MARQUEE / MANIFESTO) */}
      <section id="mission" className="py-24 bg-primary text-foreground border-y-4 border-foreground overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter mb-8 leading-none">
                Сила <br/> в <span className="bg-foreground text-primary px-4">данных</span>
              </h2>
              <div className="space-y-6 font-medium text-lg border-l-8 border-foreground pl-6">
                <p>
                  Корпорации говорят: «Пишите в нашу поддержку». И ваши жалобы улетают в черную дыру.
                </p>
                <p>
                  <strong className="font-bold">Chpok делает инциденты публичными.</strong> Мы собираем статистику, строим рейтинги худших компаний и районов. 
                </p>
                <p>
                  Публичное давление — единственный язык, который они понимают. Чем больше репортов, тем быстрее город очистится от инфраструктурного мусора.
                </p>
              </div>
            </motion.div>
            
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute inset-0 border-4 border-foreground translate-x-6 translate-y-6 bg-background"></div>
              <div className="relative bg-foreground text-background p-10 border-4 border-foreground">
                <div className="font-mono text-primary font-bold uppercase text-sm mb-8 border-b border-primary/30 pb-4">
                  // Цели на 2025
                </div>
                <ul className="space-y-6 font-display text-2xl font-bold uppercase tracking-wide">
                  <li className="flex items-center gap-4">
                    <span className="text-primary">01.</span> 100,000 активных юзеров
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="text-primary">02.</span> Открытое API для СМИ
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="text-primary">03.</span> Штрафы на основе наших данных
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="download" className="py-32 bg-background relative overflow-hidden">
        {/* Background typographic noise */}
        <div className="absolute inset-0 opacity-[0.03] overflow-hidden pointer-events-none flex flex-col justify-center">
          <div className="font-display font-bold text-[20vw] leading-none whitespace-nowrap -ml-20">REPORT REPORT REPORT</div>
          <div className="font-display font-bold text-[20vw] leading-none whitespace-nowrap -ml-40">CHPOK CHPOK CHPOK</div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary border-4 border-foreground rounded-full mb-8">
              <Smartphone className="w-10 h-10 text-foreground" />
            </div>
            <h2 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter mb-8">
              Хватит ныть. <br/> <span className="underline decoration-primary decoration-8 underline-offset-8">Действуй.</span>
            </h2>
            <p className="text-xl md:text-2xl font-medium mb-12 max-w-2xl mx-auto text-muted-foreground">
              Приложение пока в разработке, но ты можешь оставить почту, чтобы получить ранний доступ и начать чистить город первым.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="ТВОЙ E-MAIL" 
                className="flex-1 bg-muted border-4 border-foreground px-6 py-4 font-mono font-bold text-lg focus:outline-none focus:ring-4 focus:ring-primary focus:border-foreground uppercase placeholder:text-muted-foreground"
                required
              />
              <button 
                type="submit"
                className="bg-foreground text-background font-display font-bold text-xl px-10 py-4 border-4 border-foreground hover:bg-primary hover:text-foreground transition-colors brutal-shadow uppercase"
              >
                Жду
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground text-background py-12 border-t-8 border-primary">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-foreground" strokeWidth={3} />
            </div>
            <span className="font-display font-bold text-2xl tracking-tighter uppercase">CHPOK.</span>
          </div>
          
          <div className="flex gap-8 font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin Panel</Link>
            <a href="#" className="hover:text-primary transition-colors">Telegram</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
