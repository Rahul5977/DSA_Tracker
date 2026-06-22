// Aggregated CS-theory curriculum. Subjects are authored in per-subject files
// under ./theory/ and concatenated here in study order: OS, DBMS, CN, OOP.
//
// A subject module exports SUBJECT ({ key, name, tag }) and DAYS
// ([ { focus, concepts: [...] }, ... ]).

import * as os from './os.js' // NOTE: os.js is created by the orchestrator later — imported anyway.
import * as dbms from './dbms.js'
import * as cn from './cn.js'
import * as oop from './oop.js'

const MODULES = [os, dbms, cn, oop]

export const SUBJECTS = MODULES.map((m) => ({ ...m.SUBJECT, days: m.DAYS }))

export const THEORY_BY_KEY = SUBJECTS.reduce((acc, s) => {
  acc[s.key] = s
  return acc
}, {})
