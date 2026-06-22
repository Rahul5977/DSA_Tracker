// Operating Systems — full curriculum, assembled from authored parts.
// Days 1–9 (process/concurrency), 10–17 (memory/file/IO), 18 (interview round-up).
// Concept = { id, topic, summary, explanation, keyPoints:[], links:[{label,url}], interview:[{q,a}] }
// Day = { focus, concepts:[...] }

import { DAYS as PART1 } from './os.part1.js'
import { DAYS as PART2 } from './os.part2.js'
import { DAYS as ROUNDUP } from './os.roundup.js'

export const SUBJECT = {
  key: 'os',
  name: 'Operating Systems',
  tag: 'processes · memory · concurrency · files',
}

export const DAYS = [...PART1, ...PART2, ...ROUNDUP]
