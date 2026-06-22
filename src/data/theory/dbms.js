// Database Management Systems — full curriculum, assembled from authored parts.
// Days 1–6 (foundations → normalization), 7–12 (BCNF → SQL → transactions → indexing).
// Concept = { id, topic, summary, explanation, keyPoints:[], links:[{label,url}], interview:[{q,a}] }
// Day = { focus, concepts:[...] }

import { DAYS as PART1 } from './dbms.part1.js'
import { DAYS as PART2 } from './dbms.part2.js'

export const SUBJECT = { key: 'dbms', name: 'DBMS', tag: 'ER · normalization · SQL · transactions · indexing' }

export const DAYS = [...PART1, ...PART2]
