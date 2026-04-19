'use client'

import { AvailabilityEntry } from '@/lib/types'
import { getMemberColor } from '@/lib/colors'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
  isBefore,
  startOfDay,
} from 'date-fns'

interface MonthGridProps {
  month: Date
  entriesByDate: Record<string, AvailabilityEntry[]>
  allNames: string[]
  userName: string
  selectedDates: Set<string>
  pendingRemove: string | null
  onDateClick: (date: string) => void
}

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function MonthGrid({
  month,
  entriesByDate,
  allNames,
  userName,
  selectedDates,
  pendingRemove,
  onDateClick,
}: MonthGridProps) {
  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  })
  const firstDayOffset = getDay(startOfMonth(month))
  const today = startOfDay(new Date())
  const totalPeople = allNames.length

  return (
    <div className="bg-white/30 rounded-2xl border border-fog/80 p-4 md:p-5">
      {/* Month header */}
      <h3 className="font-display text-2xl font-bold italic text-earth-text mb-4 px-1">
        {format(month, 'MMMM')}
        <span className="font-normal text-lg text-pebble ml-2 not-italic">
          {format(month, 'yyyy')}
        </span>
      </h3>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map(d => (
          <div key={d} className="text-center text-[10px] font-body text-pebble/60 py-1 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Offset empty cells */}
        {Array.from({ length: firstDayOffset }, (_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const dayEntries = entriesByDate[dateStr] ?? []
          const isPast = isBefore(day, today)
          const isTodayDate = isToday(day)
          const isSelected = selectedDates.has(dateStr)
          const isPendingRemove = pendingRemove === dateStr
          const isMyBusy = dayEntries.some(e => e.name === userName)
          const count = dayEntries.length
          // "Many blocked" = majority of known members can't make it
          const manyBlocked = totalPeople > 1 && count >= Math.ceil(totalPeople * 0.5)
          // "Some blocked" = a minority have conflicts
          const someBlocked = totalPeople > 1 && count > 0 && !manyBlocked

          let bgColor = 'transparent'
          let borderColor = 'transparent'

          if (isPendingRemove) {
            bgColor = 'rgba(196, 88, 88, 0.12)'
            borderColor = 'rgba(196, 88, 88, 0.5)'
          } else if (isSelected) {
            bgColor = 'rgba(196, 88, 88, 0.15)'
            borderColor = 'rgba(196, 88, 88, 0.65)'
          } else if (manyBlocked) {
            bgColor = 'rgba(196, 88, 88, 0.08)'
            borderColor = 'rgba(196, 88, 88, 0.30)'
          } else if (someBlocked) {
            bgColor = 'rgba(201, 168, 76, 0.08)'
            borderColor = 'rgba(201, 168, 76, 0.35)'
          } else if (isMyBusy) {
            bgColor = 'rgba(138, 74, 90, 0.08)'
            borderColor = 'rgba(138, 74, 90, 0.25)'
          }

          const canInteract = !isPast && !!userName

          return (
            <button
              key={dateStr}
              onClick={() => canInteract && onDateClick(dateStr)}
              disabled={!canInteract}
              className={`
                date-cell relative rounded-lg border flex flex-col items-center justify-start py-1 px-0.5
                min-h-[52px] outline-none focus-visible:ring-2 focus-visible:ring-moss
                ${canInteract ? 'hover:bg-fog/80 cursor-pointer' : 'cursor-default'}
                ${isTodayDate ? 'ring-1 ring-pebble/30 ring-inset' : ''}
              `}
              style={{ backgroundColor: bgColor, borderColor }}
              title={dayEntries.length > 0 ? `Busy: ${dayEntries.map(e => e.name).join(', ')}` : undefined}
            >
              {/* Date number */}
              <span
                className={`
                  font-body text-[11px] font-semibold leading-none mt-1
                  ${isPast ? 'text-pebble/30' : isTodayDate ? 'text-moss' : 'text-earth-text'}
                `}
              >
                {format(day, 'd')}
              </span>

              {/* Heavy-conflict warning */}
              {manyBlocked && (
                <span className="text-[9px] text-red-400 leading-none mt-0.5" aria-label="Many conflicts">
                  ✕
                </span>
              )}

              {/* Availability dots */}
              {dayEntries.length > 0 && (
                <div className="flex flex-wrap gap-[2px] justify-center mt-1 px-0.5">
                  {dayEntries.slice(0, 4).map(entry => {
                    const color = getMemberColor(entry.name, allNames)
                    return (
                      <span
                        key={entry.id}
                        className="block w-[8px] h-[8px] rounded-full flex-shrink-0"
                        style={{ backgroundColor: color.bg }}
                        title={entry.name}
                      />
                    )
                  })}
                  {dayEntries.length > 4 && (
                    <span className="block w-[8px] h-[8px] rounded-full bg-pebble/40 flex-shrink-0" />
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
