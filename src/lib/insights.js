// Derived analytics on top of the base metrics — the "how am I really doing" layer.

import { addDays, daysBetween, todayStr } from './dates.js'
import { isPseudo } from './problems.js'
import { probId } from './model.js'

// Longest run of consecutive calendar days that each had >=1 solve.
export function longestStreak(byDate) {
  const dates = Object.keys(byDate).filter((d) => byDate[d] > 0).sort()
  let best = 0, cur = 0, prev = null
  for (const d of dates) {
    cur = prev && daysBetween(prev, d) === 1 ? cur + 1 : 1
    if (cur > best) best = cur
    prev = d
  }
  return best
}

export function activeDays(byDate) {
  return Object.keys(byDate).filter((d) => byDate[d] > 0).length
}

// Solves in the trailing `days` window (inclusive of today).
export function recentCount(byDate, days) {
  const today = todayStr()
  let n = 0
  for (let i = 0; i < days; i++) n += byDate[addDays(today, -i)] || 0
  return n
}

export function bestDay(byDate) {
  let max = 0
  for (const d in byDate) if (byDate[d] > max) max = byDate[d]
  return max
}

// Pace required from today to finish remaining problems by the planned end date,
// vs. the pace achieved so far.
export function paceStats(metrics, startDate) {
  const today = todayStr()
  const elapsed = Math.max(1, daysBetween(startDate, today) + 1)
  const remaining = Math.max(0, metrics.total - metrics.solved)
  const daysLeft = Math.max(1, metrics.totalDays - elapsed)
  return {
    current: metrics.solved / elapsed,            // problems/day so far
    required: remaining / daysLeft,               // problems/day needed
    perActiveDay: activeDays(metrics.byDate) ? metrics.solved / activeDays(metrics.byDate) : 0,
    remaining,
    daysLeft,
  }
}

// Phases with the lowest completion that still have work left — where to focus next.
export function weakestPhases(phaseMetrics, limit = 3) {
  return phaseMetrics
    .map((p, i) => ({ ...p, idx: i, frac: p.total ? p.solved / p.total : 0 }))
    .filter((p) => p.total > 0 && p.solved < p.total)
    .sort((a, b) => a.frac - b.frac)
    .slice(0, limit)
}

// Per-day solve counts for the trailing `days` window, oldest -> newest.
export function dailySeries(byDate, days) {
  const today = todayStr()
  const out = []
  for (let i = days - 1; i >= 0; i--) {
    const date = addDays(today, -i)
    out.push({ date, count: byDate[date] || 0 })
  }
  return out
}

// This week vs. the previous week, with a percentage delta.
export function weekDelta(byDate) {
  const thisWeek = recentCount(byDate, 7)
  const prevWeek = recentCount(byDate, 14) - thisWeek
  let pct = 0
  if (prevWeek > 0) pct = Math.round(((thisWeek - prevWeek) / prevWeek) * 100)
  else if (thisWeek > 0) pct = 100
  return { thisWeek, prevWeek, pct, up: thisWeek >= prevWeek }
}

// Most recently solved real problems, newest first (derived live from done state).
export function recentlySolved(slots, state, limit = 6) {
  const out = []
  for (const slot of slots) {
    for (let k = 0; k < slot.items.length; k++) {
      const it = slot.items[k]
      if (isPseudo(it[0])) continue
      const r = state.done[probId(slot, k)]
      if (r && r.done) out.push({ title: it[0], source: it[1], diff: it[2], slug: it[3], date: r.doneDate || '' })
    }
  }
  out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  return out.slice(0, limit)
}

// The next handful of unsolved, real (linkable) problems in plan order.
export function nextUp(slots, state, limit = 5) {
  const out = []
  for (const slot of slots) {
    for (let k = 0; k < slot.items.length; k++) {
      const it = slot.items[k]
      if (isPseudo(it[0])) continue
      const r = state.done[probId(slot, k)]
      if (r && r.done) continue
      out.push({ title: it[0], source: it[1], diff: it[2], slug: it[3], focus: slot.focus })
      if (out.length >= limit) return out
    }
  }
  return out
}
