'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function KeswickPin() {
  return (
    <motion.div
      className="flex flex-col items-center mb-6"
      variants={{
        hidden: { opacity: 0, y: -10, scale: 0.85 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {/* Pill label */}
      <div
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full font-body text-xs font-semibold text-white"
        style={{ background: 'rgba(74,103,65,0.80)', backdropFilter: 'blur(8px)', letterSpacing: '0.08em' }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
          <circle cx="5" cy="5" r="3" fill="white" fillOpacity="0.9" />
        </svg>
        Keswick
      </div>

      {/* Dropdown pin */}
      <div className="relative flex flex-col items-center">
        <svg width="22" height="28" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z"
            fill="#4a6741"
          />
          <circle cx="14" cy="14" r="5.5" fill="white" />
        </svg>

        {/* Pulse ring */}
        <motion.div
          className="absolute rounded-full border border-white/40"
          style={{ width: 22, height: 22, top: 0, left: 0 }}
          animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 1.8 }}
        />
      </div>
    </motion.div>
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
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {
      // autoplay blocked — still fine, poster fallback shows
    })
  }, [])

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Video background — explicit z-0 so Framer Motion wrappers don't obscure it */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Overlay — light enough to see the video clearly */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background:
            'linear-gradient(to bottom, rgba(15,25,12,0.35) 0%, rgba(10,18,8,0.20) 50%, rgba(15,25,12,0.50) 100%)',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative text-center px-6 max-w-5xl mx-auto select-none"
        style={{ zIndex: 10 }}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Keswick pin — sits above eyebrow in the content flow */}
        <KeswickPin />

        {/* Eyebrow */}
        <motion.p
          className="font-body text-white/70 text-xs tracking-[0.35em] uppercase mb-8"
          variants={fadeIn}
        >
          Family trip · Summer 2026
        </motion.p>

        {/* Main title */}
        <motion.h1
          className="font-display font-black italic leading-[0.9] text-white drop-shadow-lg"
          style={{ fontSize: 'clamp(5rem, 14vw, 11rem)' }}
          variants={fadeUp}
        >
          Poplett&apos;s
          <br />
          <span className="text-[#8ecb80]">2026</span>
        </motion.h1>

        {/* Ruled line */}
        <motion.div
          className="origin-left mx-auto mt-7 mb-7 h-px bg-white/30"
          style={{ width: '120px' }}
          variants={expandX}
        />

        {/* Subtitle */}
        <motion.p
          className="font-body text-white/75 text-base md:text-lg tracking-wide"
          variants={fadeUp}
        >
          The Lake District — when are we not free?
        </motion.p>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
        style={{ zIndex: 10 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        aria-hidden="true"
      >
        <span className="font-body text-[10px] tracking-[0.25em] uppercase">
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
