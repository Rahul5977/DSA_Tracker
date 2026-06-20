import { useState } from 'react'
import { fmt, todayStr } from '../lib/dates.js'

// First-run modal: ask the user when their Day 1 is before the campaign starts.
export default function Onboarding({ totalDays, onConfirm }) {
  const [date, setDate] = useState(todayStr())

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="glyph">A</div>
        <h2 className="disp">Welcome to Ascent.</h2>
        <p className="modal-lede">
          A {totalDays}-day DSA placement campaign — 381 problems on LeetCode &amp; GeeksforGeeks,
          checked off day by day. First, when does <b>Day&nbsp;1</b> begin? Every date in your plan
          is counted from here.
        </p>

        <label className="modal-field">
          <span>Your Day 1</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <div className="modal-presets">
          <button className="tbtn" onClick={() => setDate(todayStr())}>Today</button>
          <button className="tbtn" onClick={() => {
            const d = new Date()
            const add = (8 - d.getDay()) % 7 || 7 // next Monday
            d.setDate(d.getDate() + add)
            setDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
          }}>Next Monday</button>
        </div>

        <p className="modal-note">Starting {date ? fmt(date) : '—'}. You can change this anytime under The Plan.</p>

        <button className="primary modal-go" onClick={() => onConfirm(date || todayStr())}>
          Start the climb 🏔
        </button>
      </div>
    </div>
  )
}
