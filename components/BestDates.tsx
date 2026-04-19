import { AvailabilityEntry } from '@/lib/types'
import { format } from 'date-fns'

interface BestDatesProps {
  entriesByDate: Record<string, AvailabilityEntry[]>
  allNames: string[]
}

export default function BestDates(_props: BestDatesProps) {
  return null
}

  // Sort ascending — fewest conflicts = best dates
  const ranked = Object.entries(entriesByDate)
    .map(([date, entries]) => ({ date, count: entries.length }))
    .filter(d => d.count > 0)
    .sort((a, b) => a.count - b.count || a.date.localeCompare(b.date))
    .slice(0, 5)

  if (ranked.length === 0) return null

  return (
    <div className="mb-12 p-6 md:p-8 rounded-2xl border border-fog bg-white/40 backdrop-blur-sm">
      <p className="font-body text-xs tracking-[0.25em] uppercase text-pebble mb-4">
        Least conflicts
      </p>
      <div className="flex flex-wrap gap-3">
        {ranked.map(({ date, count }) => {
          const allBlocked = count === totalPeople
          const parsedDate = new Date(date + 'T00:00:00')
          return (
            <div
              key={date}
              className={`
                px-4 py-3 rounded-xl border text-sm transition-all
                ${
                  allBlocked
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : count === 1
                    ? 'bg-fog/60 border-fog text-earth-text'
                    : 'bg-gold/5 border-gold/30 text-earth-text'
                }
              `}
            >
              <div className="font-body font-semibold">
                {format(parsedDate, 'EEE d MMM')}
              </div>
              <div className="font-body text-xs opacity-60 mt-0.5">
                {count} of {totalPeople} can&apos;t make it
                {allBlocked && (
                  <span className="ml-1 text-red-500 font-medium">· everyone busy</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
