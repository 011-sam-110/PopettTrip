'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, hasSupabase } from '@/lib/supabase'
import { AvailabilityEntry } from '@/lib/types'
import { getMemberColor, getInitials } from '@/lib/colors'
import MonthGrid from './MonthGrid'
import BestDates from './BestDates'
import { format, addMonths } from 'date-fns'

// April 2026 → September 2026
const START_MONTH = new Date(2026, 3, 1)
const MONTHS_TO_SHOW = 6

function NameInput({
  userName,
  onSave,
}: {
  userName: string
  onSave: (name: string) => void
}) {
  const [draft, setDraft] = useState(userName)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDraft(userName)
  }, [userName])

  const save = () => {
    const trimmed = draft.trim()
    if (trimmed) onSave(trimmed)
  }

  return (
    <div className="mb-10">
      <label className="block font-body text-xs tracking-[0.28em] uppercase text-pebble mb-3">
        Who are you?
      </label>
      <div className="flex items-end gap-4 max-w-sm">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={e => e.key === 'Enter' && (save(), inputRef.current?.blur())}
            placeholder="Enter your name…"
            className="w-full bg-transparent border-b-2 border-fog focus:border-moss outline-none py-2 font-body text-lg text-earth-text placeholder:text-pebble/40 transition-colors duration-200"
          />
        </div>
        {draft.trim() && draft.trim() !== userName && (
          <button
            onClick={save}
            className="font-body text-sm text-moss hover:text-forest transition-colors pb-2 whitespace-nowrap"
          >
            Save →
          </button>
        )}
      </div>
      {userName && (
        <motion.p
          className="font-body text-sm text-pebble mt-2"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Welcome back,{' '}
          <span className="text-moss font-medium">{userName}</span>
        </motion.p>
      )}
    </div>
  )
}

export default function CalendarSection() {
  const [userName, setUserName] = useState('')
  const [entries, setEntries] = useState<AvailabilityEntry[]>([])
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())
  const [pendingComment, setPendingComment] = useState('')
  const [pendingRemove, setPendingRemove] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Restore name from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('poplate-name')
    if (stored) setUserName(stored)
  }, [])

  const handleNameSave = (name: string) => {
    setUserName(name)
    localStorage.setItem('poplate-name', name)
  }

  const loadEntries = useCallback(async () => {
    if (!supabase) {
      setLoading(false)
      return
    }
    const { data, error } = await supabase
      .from('availability_entries')
      .select('*')
      .order('date', { ascending: true })

    if (!error && data) setEntries(data as AvailabilityEntry[])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadEntries()

    if (!supabase) return

    const channel = supabase
      .channel('availability_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'availability_entries' },
        () => loadEntries()
      )
      .subscribe()

    return () => {
      void supabase?.removeChannel(channel)
    }
  }, [loadEntries])

  const allNames = Array.from(new Set(entries.map(e => e.name))).sort()

  const entriesByDate = entries.reduce<Record<string, AvailabilityEntry[]>>(
    (acc, entry) => {
      if (!acc[entry.date]) acc[entry.date] = []
      acc[entry.date].push(entry)
      return acc
    },
    {}
  )

  const handleDateClick = (dateStr: string) => {
    if (!userName) return

    const hasMyEntry = entries.some(
      e => e.date === dateStr && e.name === userName
    )

    if (hasMyEntry) {
      setPendingRemove(prev => (prev === dateStr ? null : dateStr))
      return
    }

    setSelectedDates(prev => {
      const next = new Set(prev)
      if (next.has(dateStr)) next.delete(dateStr)
      else next.add(dateStr)
      return next
    })
  }

  const confirmAdd = async () => {
    if (!supabase || !userName || selectedDates.size === 0) return
    setSaving(true)

    const inserts = Array.from(selectedDates).map(date => ({
      name: userName,
      date,
      comment: pendingComment.trim() || null,
    }))

    await supabase.from('availability_entries').insert(inserts)
    setSelectedDates(new Set())
    setPendingComment('')
    setSaving(false)
    await loadEntries()
  }

  const confirmRemove = async (dateStr: string) => {
    if (!supabase) return
    const entry = entries.find(
      e => e.date === dateStr && e.name === userName
    )
    if (!entry) return

    await supabase.from('availability_entries').delete().eq('id', entry.id)
    setPendingRemove(null)
    await loadEntries()
  }

  const months = Array.from({ length: MONTHS_TO_SHOW }, (_, i) =>
    addMonths(START_MONTH, i)
  )

  return (
    <section className="px-4 md:px-10 lg:px-20 py-20 max-w-7xl mx-auto">
      {/* Section header */}
      <motion.div
        className="mb-14"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="font-body text-xs tracking-[0.28em] uppercase text-pebble mb-3">
          Availability planner
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-bold italic text-earth-text leading-tight">
          When can&apos;t you make it?
        </h2>
        <p className="font-body text-pebble mt-3 text-base">
          Tap dates to mark when you&apos;re not free. We&apos;ll find the gaps where everyone can make it.
        </p>
      </motion.div>

      {/* Supabase not configured notice */}
      {!hasSupabase && (
        <div className="mb-8 px-5 py-4 rounded-xl border border-gold/40 bg-gold/5 text-sm font-body text-pebble">
          <strong className="text-earth-text">Supabase not connected.</strong>{' '}
          Set up your{' '}
          <code className="text-moss">.env.local</code> to enable live sharing.
          See README for instructions.
        </div>
      )}

      {/* Name input */}
      <NameInput userName={userName} onSave={handleNameSave} />

      {/* Member legend */}
      {allNames.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {allNames.map(name => {
            const color = getMemberColor(name, allNames)
            return (
              <div key={name} className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold font-body flex-shrink-0"
                  style={{ backgroundColor: color.bg, color: color.text }}
                >
                  {getInitials(name)}
                </div>
                <span className="font-body text-sm text-pebble">{name}</span>
              </div>
            )
          })}
        </motion.div>
      )}

      {/* Best dates panel */}
      {Object.keys(entriesByDate).length > 0 && allNames.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BestDates entriesByDate={entriesByDate} allNames={allNames} />
        </motion.div>
      )}

      {/* No-name nudge */}
      {!userName && (
        <p className="text-center font-body text-pebble py-8 text-sm">
          Enter your name above to start marking your unavailable dates ↑
        </p>
      )}

      {/* Loading shimmer */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-fog/50 animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      )}

      {/* Calendar grids */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {months.map((month, i) => (
            <motion.div
              key={month.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <MonthGrid
                month={month}
                entriesByDate={entriesByDate}
                allNames={allNames}
                userName={userName}
                selectedDates={selectedDates}
                pendingRemove={pendingRemove}
                onDateClick={handleDateClick}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Footer legend */}
      {allNames.length > 1 && (
        <div className="mt-10 flex flex-wrap gap-5 text-xs font-body text-pebble">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm border border-red-300 bg-red-50" />
            Many can&apos;t make it (50 %+)
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm border border-gold/50 bg-gold/10" />
            Some conflicts
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm border border-pebble/20 bg-pebble/5" />
            Your busy dates
          </div>
        </div>
      )}

      {/* ── Floating action panel: add ── */}
      <AnimatePresence>
        {selectedDates.size > 0 && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[min(92vw,460px)]"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          >
            <div className="bg-earth-text text-earth-bg rounded-2xl shadow-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-body font-semibold text-sm">
                  {selectedDates.size} date
                  {selectedDates.size !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => setSelectedDates(new Set())}
                  className="font-body text-xs text-white/50 hover:text-white/80 transition-colors"
                >
                  Clear
                </button>
              </div>
              <input
                type="text"
                value={pendingComment}
                onChange={e => setPendingComment(e.target.value)}
                placeholder="Reason — optional (e.g. holiday, work)…"
                className="w-full bg-white/10 rounded-lg px-3 py-2 font-body text-sm outline-none placeholder:text-white/30 focus:bg-white/15 transition-colors"
              />
              <button
                onClick={confirmAdd}
                disabled={saving}
                className="w-full bg-moss hover:bg-forest text-white rounded-lg py-2.5 font-body text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Mark as unavailable'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating action panel: remove ── */}
      <AnimatePresence>
        {pendingRemove && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[min(92vw,400px)]"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          >
            <div className="bg-earth-text text-earth-bg rounded-2xl shadow-2xl p-4 flex flex-col gap-3">
              <p className="font-body text-sm">
                Mark yourself as free on{' '}
                <strong>
                  {format(
                    new Date(pendingRemove + 'T00:00:00'),
                    'EEEE d MMMM'
                  )}
                </strong>
                ? (removes your conflict)
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setPendingRemove(null)}
                  className="flex-1 rounded-lg py-2.5 font-body text-sm border border-white/20 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmRemove(pendingRemove)}
                  className="flex-1 rounded-lg py-2.5 font-body text-sm bg-red-500 hover:bg-red-600 transition-colors font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
