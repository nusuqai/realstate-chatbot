export const locales = ['en', 'ar'] as const

export type Locale = (typeof locales)[number]

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function localePath(locale: Locale, path = '/') {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`
}

export function oppositeLocale(locale: Locale): Locale {
  return locale === 'ar' ? 'en' : 'ar'
}
