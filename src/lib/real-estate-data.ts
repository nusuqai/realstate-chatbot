import amenitiesAr from '@/data/real-estate/amenities/ar'
import amenitiesEn from '@/data/real-estate/amenities/en'
import developersAr from '@/data/real-estate/developers/ar'
import developersEn from '@/data/real-estate/developers/en'
import feedbackAr from '@/data/real-estate/feedback/ar'
import feedbackEn from '@/data/real-estate/feedback/en'
import investmentsAr from '@/data/real-estate/investments/ar'
import investmentsEn from '@/data/real-estate/investments/en'
import locationsAr from '@/data/real-estate/locations/ar'
import locationsEn from '@/data/real-estate/locations/en'
import projectsAr from '@/data/real-estate/projects/ar'
import projectsEn from '@/data/real-estate/projects/en'
import type { Locale } from '@/i18n/config'

export type Project = {
  id: string
  name: string
  developer_id: string
  developer: string
  city: string
  location: string
  project_type: string
  price_min: number
  price_max: number
  delivery_date: string
  rating: number
  tags: string[]
  is_demo: boolean
}

export type Developer = {
  id: string
  name: string
  city: string
  founded: number
  focus: string[]
  rating: number
  tags: string[]
  is_demo: boolean
}

export type Location = {
  id: string
  name: string
  city: string
  type: string
  tags: string[]
  is_demo: boolean
}

export type Investment = {
  id: string
  project_id: string
  project: string
  metric: string
  value: number
  horizon_years: number
  risk_level: string
  notes: string
  is_demo: boolean
}

export type Amenity = {
  id: string
  name: string
  category: string
  is_demo: boolean
}

export type Feedback = {
  id: string
  project_id: string
  project: string
  rating: number
  sentiment: string
  comment: string
  is_demo: boolean
}

export type RealEstateData = {
  projects: Project[]
  developers: Developer[]
  locations: Location[]
  investments: Investment[]
  amenities: Amenity[]
  feedback: Feedback[]
}

const cp1252Reverse = new Map<string, number>([
  ['€', 0x80],
  ['‚', 0x82],
  ['ƒ', 0x83],
  ['„', 0x84],
  ['…', 0x85],
  ['†', 0x86],
  ['‡', 0x87],
  ['ˆ', 0x88],
  ['‰', 0x89],
  ['Š', 0x8a],
  ['‹', 0x8b],
  ['Œ', 0x8c],
  ['Ž', 0x8e],
  ['‘', 0x91],
  ['’', 0x92],
  ['“', 0x93],
  ['”', 0x94],
  ['•', 0x95],
  ['–', 0x96],
  ['—', 0x97],
  ['˜', 0x98],
  ['™', 0x99],
  ['š', 0x9a],
  ['›', 0x9b],
  ['œ', 0x9c],
  ['ž', 0x9e],
  ['Ÿ', 0x9f],
])

function repairMojibake(value: string) {
  if (!/[ØÙÃ]/.test(value)) {
    return value
  }

  const bytes = Array.from(value, (char) => {
    const code = char.charCodeAt(0)
    return code <= 0xff ? code : cp1252Reverse.get(char) ?? code
  })

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(bytes))
  } catch {
    return value
  }
}

function deepRepair<T>(value: T): T {
  if (typeof value === 'string') {
    return repairMojibake(value) as T
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepRepair(item)) as T
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, deepRepair(item)]),
    ) as T
  }

  return value
}

const dataByLocale: Record<Locale, RealEstateData> = {
  en: {
    projects: projectsEn as Project[],
    developers: developersEn as Developer[],
    locations: locationsEn as Location[],
    investments: investmentsEn as Investment[],
    amenities: amenitiesEn as Amenity[],
    feedback: feedbackEn as Feedback[],
  },
  ar: deepRepair({
    projects: projectsAr,
    developers: developersAr,
    locations: locationsAr,
    investments: investmentsAr,
    amenities: amenitiesAr,
    feedback: feedbackAr,
  }) as RealEstateData,
}

export function getRealEstateData(locale: Locale): RealEstateData {
  return dataByLocale[locale]
}

export function formatMoney(value: number, locale: Locale) {
  const amount = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    maximumFractionDigits: 1,
  }).format(value / 1000000)

  return locale === 'ar' ? `${amount} مليون جنيه` : `${amount}M EGP`
}

export function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function getMarketStats(data: RealEstateData, locale: Locale) {
  const avgRating =
    data.projects.reduce((total, project) => total + project.rating, 0) / data.projects.length
  const avgEntry =
    data.projects.reduce((total, project) => total + project.price_min, 0) / data.projects.length
  const topProject = [...data.projects].sort((a, b) => b.rating - a.rating)[0]

  return {
    projectCount: data.projects.length,
    developerCount: data.developers.length,
    locationCount: data.locations.length,
    avgRating: avgRating.toFixed(1),
    avgEntry: formatMoney(avgEntry, locale),
    topProject: topProject?.name ?? '',
  }
}

export function getFeaturedProjects(data: RealEstateData) {
  return [...data.projects]
    .sort((a, b) => b.rating - a.rating || a.price_min - b.price_min)
    .slice(0, 6)
}

export function getTopDevelopers(data: RealEstateData) {
  return [...data.developers].sort((a, b) => b.rating - a.rating).slice(0, 8)
}

export function getInvestmentLeaders(data: RealEstateData) {
  return [...data.investments].sort((a, b) => b.value - a.value).slice(0, 8)
}

export function getLocationGroups(data: RealEstateData) {
  return Object.entries(
    data.locations.reduce<Record<string, Location[]>>((groups, location) => {
      groups[location.city] = groups[location.city] ?? []
      groups[location.city].push(location)
      return groups
    }, {}),
  )
}

export function getFeedbackByProject(data: RealEstateData) {
  return [...data.feedback].sort((a, b) => b.rating - a.rating).slice(0, 8)
}

export function getAmenityCategories(data: RealEstateData) {
  return Object.entries(
    data.amenities.reduce<Record<string, number>>((categories, amenity) => {
      categories[amenity.category] = (categories[amenity.category] ?? 0) + 1
      return categories
    }, {}),
  ).sort((a, b) => b[1] - a[1])
}
