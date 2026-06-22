// Low-Level System Design — full curriculum, assembled from authored parts.
// Days 1–5 (foundations: OOP-for-design, UML, SOLID, principles, machine-coding playbook),
// 6–10 (creational + structural patterns), 11–15 (behavioral patterns),
// 16–22 (machine-coding case studies: parking lot, elevator, BookMyShow, Splitwise, …).
// Concept = { id, topic, summary, explanation, diagram, keyPoints:[], videos:[{label,url}], links:[{label,url}], interview:[{q,a}] }

import { DAYS as PART1 } from './lld.part1.js'
import { DAYS as PART2 } from './lld.part2.js'
import { DAYS as PART3 } from './lld.part3.js'
import { DAYS as PART4 } from './lld.part4.js'

export const SUBJECT = { key: 'lld', name: 'LLD', tag: 'OOP design · SOLID · patterns · machine coding' }

export const DAYS = [...PART1, ...PART2, ...PART3, ...PART4]
