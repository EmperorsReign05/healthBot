import { loadHealthRecords } from './dataLoader.js'

function textIncludes(haystack, needles) {
  const h = (haystack || '').toLowerCase()
  return needles.some(n => h.includes(n))
}

export async function answerFromKeywords(question, opts = {}) {
  const { language } = opts
  const records = await loadHealthRecords()
  const q = String(question || '').toLowerCase()

  const asksSymptoms = textIncludes(q, ['symptom', 'symptoms', 'लक्षण'])
  const asksPrevention = textIncludes(q, ['prevention', 'prevent', 'precaution', 'precautions', 'बचाव'])

  // Normalize disease mention (supports basic Hindi tokens)
  const diseaseTokens = ['dengue','malaria','diarrhea','flu','covid','typhoid']
  const hiToEn = new Map([
    ['डेंगू','dengue'],
    ['मलेरिया','malaria'],
    ['दस्त','diarrhea'],
    ['टाइफॉयड','typhoid']
  ])
  let askedDisease = diseaseTokens.find(d => q.includes(d)) || ''
  if (!askedDisease) {
    for (const [hi,en] of hiToEn.entries()) {
      if (q.includes(hi)) { askedDisease = en; break }
    }
  }

  const pick = (obj, ...keys) => {
    for (const k of keys) { if (obj[k] !== undefined && String(obj[k]).trim() !== '') return String(obj[k]).trim() }
    return ''
  }
  const splitList = (txt) => String(txt || '')
    .split(/\||,|;|\n/)
    .map(s => s.trim())
    .filter(Boolean)

  // Filter to disease if asked, otherwise keep all and rank later
  const filtered = askedDisease
    ? records.filter(r => {
        const cond = String(pick(r,'Disease','Condition','disease')).toLowerCase()
        return cond.includes(askedDisease)
      })
    : records

  // Aggregate across rows
  const symptomSet = new Set()
  const preventionSet = new Set()
  let conditionName = askedDisease || ''
  let anySource = ''
  for (const r of filtered) {
    const cond = pick(r,'Disease','Condition','disease')
    if (!conditionName && cond) conditionName = cond
    splitList(pick(r,'Symptoms','Symptom','symptoms')).forEach(v => symptomSet.add(v))
    // Gather prevention across multiple columns: Prevention and Precaution_1..4
    const precCols = [
      pick(r,'Prevention','precautions','Precautions'),
      pick(r,'Precaution_1','precaution_1'),
      pick(r,'Precaution_2','precaution_2'),
      pick(r,'Precaution_3','precaution_3'),
      pick(r,'Precaution_4','precaution_4'),
    ].filter(Boolean).join('|')
    splitList(precCols).forEach(v => preventionSet.add(v))
    if (!anySource) anySource = pick(r,'Source','Reference','url')
  }

  const symptoms = Array.from(symptomSet).slice(0, 12)
  const prevention = Array.from(preventionSet).slice(0, 12)

  if (symptoms.length === 0 && prevention.length === 0) return null

  // Compose friendly paragraph
  const joiner = (arr) => arr.length <= 2 ? arr.join(' and ') : arr.slice(0, -1).join(', ') + ', and ' + arr[arr.length - 1]
  if (language === 'hi') {
    const parts = []
    if (conditionName) parts.push(`${conditionName} के बारे में`) 
    if (symptoms.length) parts.push(`लक्षण: ${joiner(symptoms)}`)
    if (prevention.length) parts.push(`बचाव: ${joiner(prevention)}`)
    if (anySource) parts.push(`स्रोत: ${anySource}`)
    return parts.join(' | ')
  }
  const pieces = []
  if (conditionName) pieces.push(`For ${conditionName},`)
  if (symptoms.length) pieces.push(`common symptoms include ${joiner(symptoms)}.`)
  if (prevention.length) pieces.push(`Prevention includes ${joiner(prevention)}.`)
  if (anySource) pieces.push(`Source: ${anySource}.`)
  return pieces.join(' ')
}


