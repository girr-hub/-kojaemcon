'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const DEFAULT = {
  title_en: 'FIND YOUR SCENE IN KOREA',
  title_kr: '한국에서 너의 씬을 찾아라',
  subtitle: 'Events, tours & meetups for foreigners in Korea',
  cta: 'Explore Events',
}

export default function Hero({ data }: { 
  data?: { title_en:string; title_kr:string; subtitle:string; cta:string } | null
}) {
  const d = data ?? DEFAULT

  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-bg">
      <div className="absolute inset-0 opacity-[0.07]"
           style={{
             backgroundImage:
               'linear-gradient(#FFD700 1px,transparent 1px),linear-gradient(90deg,#FFD700 1px,transparent 1px)',
             backgroundSize: '64px 64px',
           }}/>
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
           style={{ background:'#FFD700' }}/>
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-20">
        <motion.div 
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          className="headline-kr text-primary text-7xl md:text-9xl leading-none">
          ㅋㅈㅋ
        </motion.div>
        <div className="sub-en text-ink/60 tracking-[0.4em] mt-2">KOJAEMCON</div>
        <motion.h1
          initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}
          className="headline-en text-ink text-6xl md:text-[140px] leading-[0.95] mt-12 uppercase">
          {d.title_en}
        </motion.h1>
        <motion.p
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.3 }}
          className="sub-en text-ink/70 text-xl md:text-2xl mt-6 max-w-2xl">
          {d.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.4 }}
          className="mt-10 flex gap-4">
          <Link href="/events"
                className="group inline-flex items-center gap-3 bg-primary text-bg px-8 py-4 sub-en uppercase font-bold tracking-wider hover:translate-x-1 transition">
            {d.cta}
            <span className="group-hover:translate-x-1 transition">→</span>
          </Link>
          <Link href="/host/new"
                className="inline-flex items-center gap-3 border border-ink/30 text-ink px-8 py-4 sub-en uppercase tracking-wider hover:border-primary hover:text-primary transition">
            Launch your event
          </Link>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 border-y border-ink/10 py-4 overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap animate-[marquee_30s_linear_infinite] headline-en text-ink/40 text-2xl">
          {Array(8).fill('PARTY · TOUR · MEETUP · LANGUAGE · CULTURE · FOOD ·').map((t,i)=>
            <span key={i}>{t}</span>)}
        </div>
      </div>
    </section>
  )
}
