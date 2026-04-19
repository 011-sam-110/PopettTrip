'use client'

import { motion } from 'framer-motion'

function TopoBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g stroke="#6b7c5a" strokeWidth="0.9" fill="none" opacity="0.20">
        {/* Main peak — left-centre */}
        <g transform="rotate(-8, 380, 460)">
          <ellipse cx="380" cy="460" rx="42" ry="26" />
          <ellipse cx="380" cy="460" rx="98" ry="60" />
          <ellipse cx="380" cy="460" rx="162" ry="98" />
          <ellipse cx="380" cy="460" rx="235" ry="143" />
          <ellipse cx="380" cy="460" rx="318" ry="194" />
          <ellipse cx="380" cy="460" rx="412" ry="252" />
          <ellipse cx="380" cy="460" rx="516" ry="316" />
          <ellipse cx="380" cy="460" rx="630" ry="386" />
        </g>

        {/* Secondary peak — upper right */}
        <g transform="rotate(14, 1080, 270)">
          <ellipse cx="1080" cy="270" rx="32" ry="20" />
          <ellipse cx="1080" cy="270" rx="80" ry="49" />
          <ellipse cx="1080" cy="270" rx="138" ry="84" />
          <ellipse cx="1080" cy="270" rx="205" ry="125" />
          <ellipse cx="1080" cy="270" rx="282" ry="172" />
          <ellipse cx="1080" cy="270" rx="368" ry="225" />
          <ellipse cx="1080" cy="270" rx="464" ry="284" />
        </g>

        {/* Small shoulder — lower right */}
        <g transform="rotate(6, 1260, 710)">
          <ellipse cx="1260" cy="710" rx="26" ry="17" />
          <ellipse cx="1260" cy="710" rx="65" ry="42" />
          <ellipse cx="1260" cy="710" rx="114" ry="72" />
          <ellipse cx="1260" cy="710" rx="172" ry="108" />
          <ellipse cx="1260" cy="710" rx="238" ry="150" />
        </g>

        {/* Far-left bump */}
        <g transform="rotate(-22, 110, 660)">
          <ellipse cx="110" cy="660" rx="20" ry="13" />
          <ellipse cx="110" cy="660" rx="52" ry="33" />
          <ellipse cx="110" cy="660" rx="92" ry="58" />
          <ellipse cx="110" cy="660" rx="140" ry="88" />
        </g>
      </g>
    </svg>
  )
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
}

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7 } },
}

const expandX = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function HeroSection() {
  return (
    <section
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Atmospheric radial gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 60% at 25% 65%, rgba(74,103,65,0.13) 0%, transparent 100%),' +
            'radial-gradient(ellipse 40% 50% at 78% 30%, rgba(74,103,65,0.08) 0%, transparent 100%)',
        }}
      />

      {/* Topographic lines */}
      <TopoBackground />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto select-none"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Eyebrow */}
        <motion.p
          className="font-body text-pebble text-xs tracking-[0.35em] uppercase mb-8"
          variants={fadeIn}
        >
          Family trip · Summer 2026
        </motion.p>

        {/* Main title */}
        <motion.h1
          className="font-display font-black italic leading-[0.9] text-earth-text"
          style={{ fontSize: 'clamp(5rem, 14vw, 11rem)' }}
          variants={fadeUp}
        >
          Poplate
          <br />
          <span
            className="text-moss"
            style={{ WebkitTextStroke: '0px' }}
          >
            2026
          </span>
        </motion.h1>

        {/* Ruled line */}
        <motion.div
          className="origin-left mx-auto mt-7 mb-7 h-px bg-pebble/30"
          style={{ width: '120px' }}
          variants={expandX}
        />

        {/* Subtitle */}
        <motion.p
          className="font-body text-pebble text-base md:text-lg tracking-wide"
          variants={fadeUp}
        >
          The Lake District — let&apos;s find our window
        </motion.p>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-pebble"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        aria-hidden="true"
      >
        <span className="font-body text-[10px] tracking-[0.25em] uppercase opacity-60">
          Scroll
        </span>
        <div className="bounce-gentle">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path
              d="M9 2v14M3 10l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  )
}
